"use client";
import { useTransition } from "react";
import Form from "../Form";
import Input from "../Input";
import { signIn } from "@/app/login/action";

const SignIn = ({ message }: { message: string }) => {
  const [isPending, startTransition] = useTransition();
  const signInHandler = async (formData: FormData) => {
    startTransition(async () => {
      await signIn(formData);
    });
  };
  return (
    <div>
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
          <button
            formAction={signInHandler}
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

export default SignIn;
