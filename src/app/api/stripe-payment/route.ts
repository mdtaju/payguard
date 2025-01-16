import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

import { accessTokenCheck } from "@/lib/accessTokenCheck";

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const authToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    const [role] = accessTokenCheck(authToken as string);

    if (role !== "user") {
      return NextResponse.json(
        { message: "Unauthorized access", result: [] },
        { status: 401 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: false },
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
