import SignUp from "@/components/SignUp";
import { GetUser } from "@/serverActions/getUser";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

const SignupPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) => {
  const { message } = await searchParams;
  const user = await GetUser();

  if (user) redirect("/"); // user already logged in

  // signup function

  return (
    <main>
      <SignUp message={message} />
    </main>
  );
};

export default SignupPage;
