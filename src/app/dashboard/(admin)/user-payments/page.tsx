import PaymentsTableEditable from "@/components/PaymentsTableEditable";
import { accessTokenMake } from "@/serverActions/accessToken";
import { GetUser } from "@/serverActions/getUser";
import { AuthUser, PaymentType } from "@/types/allTypes";
import "@ant-design/v5-patch-for-react-19";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

const UserPaymentsPage = async () => {
  const user: AuthUser | null = await GetUser();
  if (user?.user_metadata?.role !== "admin") redirect("/dashboard");

  const token = accessTokenMake({
    role: "admin",
  });

  const serverResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
  // if successfully save payment data to database
  const res = await serverResponse.json();
  const data: PaymentType[] = res.result;
  return (
    <div>
      <PaymentsTableEditable data={data} token={token} />
    </div>
  );
};

export default UserPaymentsPage;
