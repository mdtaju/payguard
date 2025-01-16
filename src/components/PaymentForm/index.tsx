"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import Form from "../Form";
import Input from "../Input";
import Checkout from "../PaymentCheckout";

function convertToSubCurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PaymentForm = ({
  userName,
  userId,
  token,
}: {
  userName: string;
  userId?: string;
  token: string;
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [amountNumber, setAmountNumber] = useState(0);
  const [message, setMessage] = useState("");
  const [isDataReady, setIsDataReady] = useState(false);

  const submitPayment = () => {
    setMessage("");
    setIsDataReady(false);
    const amountToNumber = parseFloat(amount);

    if (title === "" || amount === "") {
      return setMessage("All filed are require");
    }

    if (typeof amountToNumber !== "number") {
      return setMessage("Amount must be a number");
    }

    if (amountToNumber <= 0) {
      return setMessage("Number is not valid");
    }

    setAmountNumber(amountToNumber);
    setIsDataReady(true);
  };

  return (
    <div>
      {isDataReady ? (
        <div className="w-full max-w-[800px] mx-auto p-4 md:p-10 text-white text-center mt-4 md:mt-6 rounded-md bg-accent custom_shadow">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold mb-2">PayGuard</h1>
            <h2 className="text-2xl">
              {`${userName} has requested`}
              <span className="font-bold"> ${amount}</span>
              {` for "${title}"`}
            </h2>
          </div>

          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubCurrency(amountNumber),
              currency: "usd",
              paymentMethodTypes: ["card"],
            }}>
            <Checkout
              amount={amountNumber}
              title={title}
              userId={userId}
              token={token}
            />
          </Elements>
        </div>
      ) : (
        <Form title="Payment Form">
          <form>
            <Input
              title="Title"
              placeholder="Enter a title"
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              title="Amount (USD)"
              placeholder="Enter an amount"
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button formAction={submitPayment} className="btn w-full mt-6">
              Submit
            </button>
            {message && (
              <p
                className={`text-center mt-4 text-sm font-semibold
            text-red-500`}>
                {message}
              </p>
            )}
          </form>
        </Form>
      )}
    </div>
  );
};

export default PaymentForm;
