import Form from "@/components/Form";
import Input from "@/components/Input";
import { GetUser } from "@/serverActions/getUser";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
export const dynamic = "force-dynamic";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) => {
  const { message } = await searchParams;
  const user = await GetUser();

  if (user) redirect("/"); // if user already exists then redirect to home

  const signIn = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/login?message=${error.message}`);
    }

    return redirect("/dashboard");
  };

  return (
    <main>
      <Form title="Login Form">
        <form>
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
          <button formAction={signIn} className="btn w-full mt-6">
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

export default LoginPage;
