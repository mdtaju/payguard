import Notifications from "@/components/Notifications";
import { accessTokenMake } from "@/serverActions/accessToken";
import { GetUser } from "@/serverActions/getUser";
import { AuthUser, NotificationType } from "@/types/allTypes";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

const NotificationsPage = async () => {
  const user: AuthUser | null = await GetUser();
  if (user === null) redirect("/login");

  const token = accessTokenMake({
    role: user?.user_metadata ? user?.user_metadata?.role : "user",
    id: user?.identities ? user?.identities[0]?.user_id : "",
  });

  const serverResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/${
      user?.identities ? user?.identities[0]?.user_id : ""
    }`,
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
  const result: { data: NotificationType[]; totalCount: number } = res.result;
  return (
    <div>
      <Notifications
        notificationData={result}
        token={token}
        userId={user?.identities ? user?.identities[0]?.user_id : ""}
      />
    </div>
  );
};

export default NotificationsPage;
