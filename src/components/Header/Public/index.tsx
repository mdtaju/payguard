import NotificationsModal from "@/components/NotificationModal";
import { GetUser } from "@/serverActions/getUser";
import { Avatar, Badge } from "antd";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";

export const PublicHeader = async () => {
  const user = await GetUser();

  const signOut = async () => {
    "use server";
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
      return redirect("/");
    } catch {}
  };

  return (
    <header className="w-full px-4 bg-primary sticky top-0 left-0 z-[100] ">
      <div className="container mx-auto flex justify-end">
        <div className="flex items-center justify-between w-full md:w-1/2">
          <nav className="w-fit mx-auto py-4 flex-1">
            <ul className="flex items-center gap-6 text-base text-white font-semibold">
              <li className="hover:text-accent transition-all">
                <Link href={"/"}>Home</Link>
              </li>
              {user ? (
                <li className="hover:text-accent transition-all">
                  <button onClick={signOut}>Logout</button>
                </li>
              ) : (
                <>
                  <li className="hover:text-accent transition-all">
                    <Link href={"/login"}>Login</Link>
                  </li>
                  <li className="hover:text-accent transition-all">
                    <Link href={"/signup"}>Signup</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          {user && (
            <div className="flex items-center gap-3">
              <Link href={"/dashboard/profile"}>
                <Avatar
                  shape="square"
                  size="small"
                  className="bg-accent p-0.5"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  }
                />
              </Link>
              <Badge count={2}>
                <NotificationsModal />
              </Badge>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
