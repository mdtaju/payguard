import { GetUser } from "@/serverActions/getUser";
import { AuthUser } from "@/types/allTypes";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user: AuthUser | null = await GetUser();

  if (!user) redirect("/login");

  if (user.user_metadata.role === "admin") {
    return (
      <div>
        <h1>this is admin page</h1>
      </div>
    );
  } else {
    return (
      <div className="w-full py-6 text-center">
        <h1 className="text-4xl font-semibold">Welcome to Dashboard</h1>
      </div>
    );
  }
};

export default DashboardPage;
