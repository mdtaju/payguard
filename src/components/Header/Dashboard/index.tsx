"use client";
import { PrivateHeaderData } from "@/db/data";
import { AuthUser } from "@/types/allTypes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const DashboardSidebar = ({ user }: { user: AuthUser | null }) => {
  const [active, setActive] = useState(false);
  const pathname = usePathname();
  return (
    <div className="py-3 md:py-6 w-full md:w-[260px] bg-transparent md:bg-secondary h-fit md:h-screen static md:fixed">
      {/* mobile view start */}
      <div className="w-full md:hidden">
        <div className="flex items-center justify-center gap-4 px-4">
          {/* name and role */}
          <div className="flex-1">
            <p className="text-base font-semibold line-clamp-1">{`${user?.user_metadata?.role} / ${user?.user_metadata?.displayName}`}</p>
          </div>
          {/* menu button */}
          <button
            className="p-2"
            aria-label="menu-btn"
            onClick={() => setActive(true)}>
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        {/* menu list */}
        <div
          className={`w-full h-screen fixed bg-white bg-opacity-95 py-5 px-4 top-0 transition-all ${
            active ? "left-0" : "left-[-100%]"
          } z-[101]`}>
          {/* menu header start */}
          <div className="flex items-center gap-4 justify-between">
            <p className="text-base font-semibold">PayGuard</p>
            <button
              className="p-2"
              aria-label="menu-close"
              onClick={() => setActive(false)}>
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* menu header end */}
          {/* menu list start */}
          <ul className="space-y-1 mt-4">
            {PrivateHeaderData.filter(
              (item) =>
                item.roleFor === user?.user_metadata?.role ||
                item.roleFor === "all"
            ).map((item, i) => (
              <li key={i}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-4 py-1.5 transition-all rounded-md ${
                      pathname === item.path ? "bg-accent" : "hover:bg-gray-300"
                    }`}>
                    {item.Icon}
                    <span className="text-sm font-semibold text-gray-600">
                      {item.name}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {/* menu list end */}
        </div>
      </div>
      {/* mobile view end */}

      {/* desktop view start */}
      <div className="px-2 hidden md:block">
        <p className="text-base font-semibold text-center line-clamp-1">{`${user?.user_metadata?.role} / ${user?.user_metadata?.displayName}`}</p>
        <ul className="space-y-1 mt-4">
          {PrivateHeaderData.filter(
            (item) =>
              item.roleFor === user?.user_metadata?.role ||
              item.roleFor === "all"
          ).map((item, i) => (
            <li key={i}>
              <Link href={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-1.5 transition-all rounded-md ${
                    pathname === item.path ? "bg-accent" : "hover:bg-gray-300"
                  }`}>
                  {item.Icon}
                  <span className="text-sm font-semibold text-gray-600">
                    {item.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* desktop view end */}
    </div>
  );
};

export default DashboardSidebar;
