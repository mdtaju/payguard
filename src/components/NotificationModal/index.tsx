"use client";
import { dateFormation } from "@/lib/dateFormation";
import { Popover } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

const notis = [
  {
    _id: "2er",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er3",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er4",
    status: "read",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er6",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er3",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er4",
    status: "read",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er6",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er3",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er4",
    status: "read",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
  {
    _id: "2er6",
    status: "unread",
    user_id: "ii",
    message: "Hello world",
    created_at: "2025-01-14T07:13:01.792+00:00",
  },
];

const NotificationsModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(notis);

  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);

  const handleClickChange = (open: boolean) => {
    setModalOpen(open);
  };

  const handleMarkAsRead = (id: string) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (id === item._id) {
          return {
            ...item,
            status: "read",
          };
        } else {
          return item;
        }
      })
    );
  };

  const content = (
    <div className="max-h-[80vh] overflow-y-scroll notifications_scrollbar">
      {/* header */}
      <div className="flex items-center justify-between gap-4 px-2 sticky top-0 left-0 bg-white">
        <span className="text-lg font-semibold">Notifications</span>
        <Link href={"/dashboard/notifications"}>
          <span className="text-sm font-medium underline hover:text-accent transition-all">
            View all
          </span>
        </Link>
      </div>
      <ul className="space-y-3 mt-4">
        {data.map((item, i) => (
          <li
            key={i}
            className={`flex items-start gap-3 p-2  ${
              item.status === "unread" ? "bg-gray-100" : "bg-white"
            } rounded-md`}>
            <div>
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
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div className="">
              <p className="text-base line-clamp-3">{item.message}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium">
                  {dateFormation(item.created_at)}
                </span>
                {item.status === "unread" && (
                  <button
                    onClick={() => handleMarkAsRead(item._id)}
                    className="text-xs font-semibold py-1 px-3 bg-gray-300 hover:bg-gray-400 active:scale-95 transition-all rounded-md">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Popover
      overlayClassName="w-full max-w-[350px]"
      content={content}
      open={modalOpen}
      trigger={"click"}
      onOpenChange={handleClickChange}>
      <button className="p-0.5 text-white" onClick={() => setModalOpen(true)}>
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
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
      </button>
    </Popover>
  );
};

export default NotificationsModal;
