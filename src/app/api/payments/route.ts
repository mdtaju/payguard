import { createMongoConnection } from "@/config/mongodb";
import { accessTokenCheck } from "@/lib/accessTokenCheck";
import Notification from "@/models/notificationModal";
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

    if (payment?.ok) {
      // notification push
      await Notification.insertMany([
        {
          message: `Payment $${amount} for "${title}" has been successful`,
          user_id,
          created_at: Date.now(),
          role: "user",
        },
        {
          message: `New payment $${amount} has been placed for "${title}"`,
          user_id,
          created_at: Date.now(),
          role: "admin",
        },
      ]);

      // initSocket.emit("notification", [
      //   {
      //     _id: notification[0]?._id,
      //     user_id,
      //     status: "unread",
      //     message: `Payment $${amount} for "${title}" has been successful`,
      //     role: "user",
      //     created_at: Date.now(),
      //   },
      //   {
      //     _id: notification[1]?._id,
      //     user_id,
      //     status: "unread",
      //     message: `New payment $${amount} has been placed for "${title}"`,
      //     role: "admin",
      //     created_at: Date.now(),
      //   },
      // ]);

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
