"use client";
import { signUp } from "@/app/signup/action";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { useTransition } from "react";

const SignUp = ({ message }: { message: string }) => {
  const [isPending, startTransition] = useTransition();
  const signUpHandler = async (formData: FormData) => {
    startTransition(async () => {
      await signUp(formData);
    });
  };
  return (
    <div>
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
          <button
            formAction={signUpHandler}
            disabled={isPending}
            className={`btn w-full mt-6 ${
              isPending ? "opacity-40" : "opacity-100"
            }`}>
            {isPending ? "Pending..." : "Submit"}
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
    </div>
  );
};

export default SignUp;
