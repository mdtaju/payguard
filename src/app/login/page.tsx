import { GetUser } from "@/serverActions/getUser";
import { redirect } from "next/navigation";
import SignIn from "@/components/Login";
export const dynamic = "force-dynamic";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) => {
  const { message } = await searchParams;
  const user = await GetUser();

  if (user) redirect("/"); // if user already exists then redirect to home

  return (
    <main>
      <SignIn message={message} />
    </main>
  );
};

export default LoginPage;
