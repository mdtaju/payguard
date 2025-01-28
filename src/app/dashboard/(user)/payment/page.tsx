import PaymentForm from "@/components/PaymentForm";
import { accessTokenMake } from "@/serverActions/accessToken";
import { GetUser } from "@/serverActions/getUser";
import { AuthUser } from "@/types/allTypes";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

const PaymentPage = async () => {
  const user: AuthUser | null = await GetUser();
  if (user?.user_metadata?.role !== "user") redirect("/dashboard");

  const token = accessTokenMake({
    role: "user",
  });
  return (
    <div className="w-full py-6">
      {/* payment input card */}
      <PaymentForm
        userName={user.user_metadata.displayName}
        userId={user?.identities && user?.identities[0]?.user_id}
        token={token}
      />
    </div>
  );
};

export default PaymentPage;
