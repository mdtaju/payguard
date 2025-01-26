"use client";

import { useState } from "react";
import Notification from "./Notification";
import { NotificationType } from "@/types/allTypes";

const Notifications = ({
  notificationData,
  token,
  userId,
}: {
  notificationData: { data: NotificationType[]; totalCount: number };
  token: string;
  userId: string;
}) => {
  const [data, setData] = useState<{
    data: NotificationType[];
    totalCount: number;
  }>({
    data: notificationData ? notificationData.data : [],
    totalCount: notificationData ? notificationData.totalCount : 0,
  });
  const [showMoreNotification, setShowMoreNotifications] = useState(true);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) => {
        const updatedData = prevData.data.map((item) => {
          if (id === item._id) {
            return {
              ...item,
              status: "read",
            };
          } else {
            return item;
          }
        });
        return { ...prevData, data: updatedData };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoreNotifications = async () => {
    const startIndex = data.data.length;
    if (data.data.length >= data.totalCount) {
      return setShowMoreNotifications(false);
    }

    try {
      const serverResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startIndex: startIndex,
            totalDataCount: 10,
          }),
        }
      );
      // if successfully save payment data to database
      const res = await serverResponse.json();
      const result: { data: NotificationType[]; totalCount: number } =
        res.result;
      if (result?.data) {
        setData((prevData) => {
          return { ...prevData, data: [...prevData.data, ...result.data] };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full max-w-[550px] py-6 px-4 mx-auto">
      <div className="">
        {/* header */}
        <div className="flex items-center justify-between gap-4 px-2 sticky top-0 left-0 bg-white">
          <span className="text-lg font-semibold">Notifications</span>
        </div>
        <ul className="space-y-3 mt-4">
          {data.data.map((item, i) => (
            <Notification
              key={i}
              notification={item}
              handleMarkAsRead={handleMarkAsRead}
            />
          ))}
        </ul>
        {/* more button */}
        {showMoreNotification && (
          <div className="w-full mt-4 grid place-items-center">
            <button
              onClick={handleMoreNotifications}
              className="btn text-xs px-5 py-1 font-semibold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span>load more</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
