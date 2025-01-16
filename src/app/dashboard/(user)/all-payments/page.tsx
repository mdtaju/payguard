import PaymentsTable from "@/components/PaymentsTable";
import { accessTokenMake } from "@/serverActions/accessToken";
import { GetUser } from "@/serverActions/getUser";
import { AuthUser, PaymentType } from "@/types/allTypes";
import { redirect } from "next/navigation";

const AllPaymentPage = async () => {
  const user: AuthUser | null = await GetUser();
  if (user?.user_metadata?.role !== "user") redirect("/dashboard");

  const token = accessTokenMake({
    role: "user",
    id: user?.identities ? user?.identities[0]?.user_id : "",
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
      <PaymentsTable data={data} />
    </div>
  );
};

export default AllPaymentPage;
