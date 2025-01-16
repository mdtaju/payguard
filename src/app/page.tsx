import { GetUser } from "@/serverActions/getUser";
import Link from "next/link";

export default async function Home() {
  const user = await GetUser();

  return (
    <main className="px-4 py-10">
      <div className="bg-accent custom_shadow p-4 rounded-md w-full max-w-[600px] mx-auto text-center">
        <span className="text-3xl">Hey 🖐</span>
        <h1 className="text-3xl md:text-4xl font-semibold mt-6">
          Welcome to PayGuard
        </h1>
        <p className="mt-4 text-base font-medium text-justify">
          PayGaurd allows you to do secure Payment Management and Verification
          System with features such as user authentication, admin dashboard,
          document uploads, and payment tracking. The system is fully
          functional, deployed, and accessible online.{" "}
        </p>
        {user ? (
          <Link href={"/dashboard"}>
            <button className="btn">Dashboard</button>
          </Link>
        ) : (
          <div className="flex items-center gap-6 w-fit mx-auto mt-8">
            <Link href={"/login"}>
              <button className="btn">Login</button>
            </Link>
            <Link href={"/signup"}>
              <button className="btn bg-secondary text-textColor">
                Signup
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
