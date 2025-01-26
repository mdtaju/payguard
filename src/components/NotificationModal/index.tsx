"use client";
import { dateFormation } from "@/lib/dateFormation";
import { NotificationType } from "@/types/allTypes";
import { Badge, Popover } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NotificationsModal = ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<{
    data: NotificationType[];
    totalCount: number;
  }>({
    data: [],
    totalCount: 0,
  });
  const [showMoreNotification, setShowMoreNotifications] = useState(true);
  const pathname = usePathname();

  // useEffect(() => {
  //   initSocket?.connect();
  //   if (initSocket.connected) {
  //     initSocket.on("notification", (notifications: NotificationType[]) => {
  //       console.log(notifications);
  //       notifications.map((notification) => {
  //         if (notification.user_id === userId && notification.role === "user") {
  //           setData((prevNotifications) => [
  //             notification,
  //             ...prevNotifications,
  //           ]);
  //           return notification;
  //         } else if (notification.role === "admin") {
  //           setData((prevNotifications) => [
  //             notification,
  //             ...prevNotifications,
  //           ]);
  //           return notification;
  //         } else {
  //           return notification;
  //         }
  //       });
  //     });
  //   }

  //   return () => {
  //     initSocket?.disconnect();
  //   };
  // }, [userId]);

  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);

  useEffect(() => {
    if (pathname !== "/dashboard/notifications") {
      async function getNotifications() {
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
                startIndex: 0,
                totalDataCount: 10,
              }),
            }
          );
          // if successfully save payment data to database
          const res = await serverResponse.json();
          const result: { data: NotificationType[]; totalCount: number } =
            res.result;
          if (result?.data) {
            setData(result);
            if (result?.data.length >= result.totalCount) {
              setShowMoreNotifications(false);
            }
          }
        } catch {}
      }
      getNotifications();
    }
  }, [pathname, userId, token]);

  const handleClickChange = (open: boolean) => {
    setModalOpen(open);
  };

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
    } catch {}
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
    } catch {}
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
        {data.data.map((item, i) => (
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
      {/* more button */}
      {pathname !== "/dashboard/notifications" ? (
        <>
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
        </>
      ) : (
        <p className="text-center mt-6 text-sm font-semibold">
          Please see on notifications page
        </p>
      )}
    </div>
  );

  return (
    <Badge count={data.data.filter((item) => item.status === "unread").length}>
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
    </Badge>
  );
};

export default NotificationsModal;
