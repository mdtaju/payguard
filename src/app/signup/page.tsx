import Form from "@/components/Form";
import Input from "@/components/Input";
import { createMongoConnection } from "@/config/mongodb";
import User from "@/models/userModels";
import { GetUser } from "@/serverActions/getUser";
import bcrypt from "bcrypt";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

const SignupPage = async ({
  searchParams,
}: {
  searchParams: { message: string };
}) => {
  const { message } = await searchParams;
  const user = await GetUser();

  if (user) redirect("/"); // user already logged in

  // signup function
  const signUp = async (formData: FormData) => {
    "use server";
    const origin = (await headers()).get("origin");
    const name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;
    const supabase = await createClient();

    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      role === ""
    ) {
      return redirect("/signup?message=All fields are required");
    }

    if (password !== confirmPassword) {
      return redirect("/signup?message=Passwords do not match");
    }

    let redirectPath = "/";

    try {
      const hashedPassword = await bcrypt.hash(password as string, 10);

      // send data to supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/api/auth/callback`,
          data: {
            role,
            displayName: name,
          },
        },
      });

      // supabase error
      if (error) {
        redirectPath = `/signup?message=${error.message}`;
        throw new Error(`${error.message}`);
      }

      await createMongoConnection(); // mondoDB connection

      // store user to mongodb
      const res = await User.insertMany([
        {
          name,
          email,
          password: hashedPassword,
          role,
          id: data?.user?.identities && data?.user?.identities[0]?.user_id,
          created_at:
            data?.user?.identities && data?.user?.identities[0]?.created_at,
        },
      ]);

      const user = Response.json(res);
      // redirecting to message page as successfully signup
      if (!user?.ok) {
        await supabase.auth.admin.deleteUser(data.user?.id as string);

        // mongodb error
        redirectPath = `/message?message=Signup failed please try again or use another email`;
        throw new Error(
          `/message?message=Signup failed please try again or use another email`
        );
      }

      redirectPath = `/dashboard`;
    } catch (error) {
      console.log(error);
      redirectPath = `/message?message=Signup failed please try again.`;
    } finally {
      redirect(redirectPath);
    }
  };
  return (
    <main>
      <Form title="Register Form">
        <form>
          <Input
            title="Full Name"
            placeholder="Enter your full name"
            type="text"
            name="full_name"
            required
          />
          <Input
            title="Email"
            placeholder="Enter your email"
            type="email"
            name="email"
            required
          />
          <Input
            title="Password"
            placeholder="Enter your password"
            type="password"
            name="password"
            required
          />
          <Input
            title="Confirm Password"
            placeholder="Enter your password"
            type="password"
            name="confirmPassword"
            required
          />
          <div className="flex flex-col gap-1 w-full mt-4">
            <span className="text-sm font-semibold text-gray-800">
              Role <span className="text-bold text-red-500">*</span>
            </span>
            <select
              name="role"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-gray-500">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button formAction={signUp} className="btn w-full mt-6">
            Submit
          </button>
          {message && (
            <p
              className={`text-center mt-4 text-sm font-semibold
            text-red-500`}>
              {message}
            </p>
          )}
        </form>
      </Form>
    </main>
  );
};

export default SignupPage;
