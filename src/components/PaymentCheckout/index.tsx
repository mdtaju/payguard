import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";

function convertToSubCurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

const Checkout = ({
  amount,
  title,
  userId,
  token,
}: {
  amount: number;
  title: string;
  userId?: string;
  token: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/stripe-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: convertToSubCurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, token]);

  //   payment submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // checking is stipe and elements are loaded
    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      messageApi.open({
        type: "error",
        content: submitError.message,
        duration: 3,
      });
      setLoading(false);
      return;
    }

    try {
      // confirm payment to strip by request
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/payment-success?title=${title}world&amount=${amount}`,
        },
        redirect: "if_required",
      });

      //   stripe error handle
      if (error) {
        return messageApi.open({
          type: "error",
          content: error.message,
          duration: 3,
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // stripe payment success
        // store payment to database
        const serverResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount,
              title,
              user_id: userId,
            }),
          }
        );
        // if successfully save payment data to database
        const res = await serverResponse.json();

        if (res?.status === 201) {
          router.push(
            `/dashboard/payment-success?title=${title}&amount=${amount}&payment_intent=${paymentIntent.id}&redirect_status=succeeded`
          ); // success
        } else {
          // error from database
          messageApi.open({
            type: "error",
            content:
              "Payment succeeded but did not save on database. please contact with admin",
            duration: 3,
          });
        }
      } else {
        messageApi.open({
          type: "error",
          content: "Payment intent not succeed",
          duration: 3,
        });
      }
    } catch {
      messageApi.open({
        type: "error",
        content: "Payment failed. please try again",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="w-full grid place-items-center">
        <Loading />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}
      <button
        disabled={!stripe || loading}
        className="text-white w-full py-3 px-5 bg-primary mt-4 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse hover:brightness-110">
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
      {contextHolder}
    </form>
  );
};

export default Checkout;
