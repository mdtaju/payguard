import { GetUser } from "@/serverActions/getUser";
import { AuthUser } from "@/types/allTypes";
import { redirect } from "next/navigation";

const PaymentSuccess = async ({
  searchParams,
}: {
  searchParams: Promise<{
    title: string;
    amount: string;
    payment_intent: string;
    redirect_status: string;
  }>;
}) => {
  const { title, amount, payment_intent } = await searchParams;
  const user: AuthUser | null = await GetUser();
  if (user?.user_metadata?.role !== "user") redirect("/dashboard"); // user route

  const message = `Congratulations your payment $${amount} for "${title}" was successful`;

  return (
    <div className="">
      <div className="w-full max-w-[520px] mx-auto mt-4 p-4 bg-accent rounded-md custom_shadow text-white font-semibold text-base">
        <p className="text-center">{message}</p>
        <div className="border-y w-full text-center py-3 mt-3">
          <p>{`Payment Intent`}</p>
          <p className="font-medium">{payment_intent}</p>
        </div>
        <div className="border-b w-full text-center py-3">
          <p>{`Amount`}</p>
          <p className="font-medium">${amount}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
