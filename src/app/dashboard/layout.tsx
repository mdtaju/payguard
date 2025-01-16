import DashboardSidebar from "@/components/Header/Dashboard";
import { GetUser } from "@/serverActions/getUser";
import { AuthUser } from "@/types/allTypes";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const user: AuthUser | null = await GetUser();

  if (!user) redirect("/login");

  return (
    <div>
      <DashboardSidebar user={user} />
      <main className="pl-0 md:pl-[260px]">
        <div className="p-4 md:p-5">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
