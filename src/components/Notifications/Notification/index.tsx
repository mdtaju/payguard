import { dateFormation } from "@/lib/dateFormation";
import { NotificationType } from "@/types/allTypes";
import React from "react";

const Notification = ({
  notification,
  handleMarkAsRead,
}: {
  notification: NotificationType;
  handleMarkAsRead: (a: string) => void;
}) => {
  return (
    <li
      className={`flex items-start gap-3 p-2  ${
        notification.status === "unread" ? "bg-gray-100" : "bg-white"
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
        <p className="text-base line-clamp-3">{notification.message}</p>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium">
            {dateFormation(notification.created_at)}
          </span>
          {notification.status === "unread" && (
            <button
              onClick={() => handleMarkAsRead(notification._id)}
              className="text-xs font-semibold py-1 px-3 bg-gray-300 hover:bg-gray-400 active:scale-95 transition-all rounded-md">
              Mark as read
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default Notification;
