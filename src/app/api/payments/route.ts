import { createMongoConnection } from "@/config/mongodb";
import { accessTokenCheck } from "@/lib/accessTokenCheck";
import Payment from "@/models/paymentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const [role, user_id] = accessTokenCheck(authToken as string);

    await createMongoConnection();
    switch (role) {
      case "admin":
        const dataForAdmin = await Payment.find();
        return NextResponse.json(
          { message: "Data fetch success", result: dataForAdmin },
          { status: 200 }
        );
      case "user":
        // const user_id = (decodedData as { id: string }).id;
        const data = await Payment.find({ user_id });
        return NextResponse.json(
          { message: "Data fetch success", result: data },
          { status: 200 }
        );
      default:
        break;
    }
    return NextResponse.json({ message: "data not found" }, { status: 404 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      amount,
      user_id,
    }: { title: string; amount: string; user_id: string } =
      await request.json();
    const authToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    accessTokenCheck(authToken as string);
    await createMongoConnection();

    const res = await Payment.insertMany([
      { title, amount, status: "pending", user_id, created_at: Date.now() },
    ]);

    const payment = Response.json(res);

    // redirecting to message page as successfully signup
    if (payment?.ok) {
      return NextResponse.json(
        { message: `Data successfully stored`, status: 201 },
        { status: 201 }
      );
    }
    return NextResponse.json({ error: `Database error` }, { status: 500 });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
