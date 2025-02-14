import { createMongoConnection } from "@/config/mongodb";
import Notification from "@/models/notificationModal";
import Payment from "@/models/paymentModel";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const {
      status,
      user_id,
      title,
    }: { status: string; user_id: string; title: string } = await req.json();
    const { id } = await params;
    if (!authToken) {
      return NextResponse.json(
        { message: "Unauthorized access", result: [] },
        { status: 401 }
      );
    }

    const decodedData = jwt.verify(
      authToken as string,
      process.env.NEXT_PUBLIC_JWT_SECRET as string
    );
    if (!decodedData) {
      return NextResponse.json(
        { message: "Unauthorized access", result: [] },
        { status: 401 }
      );
    }
    const role = (decodedData as { role: string }).role;
    await createMongoConnection();
    if (role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized access", result: [] },
        { status: 401 }
      );
    }

    const payment = await Payment.updateOne({ _id: id }, { $set: { status } });

    if (payment.modifiedCount) {
      await Notification.insertMany([
        {
          message: `Your payment status for "${title}" was successfully updated by admin`,
          user_id,
          created_at: Date.now(),
          role: "user",
        },
        {
          message: `Payment status for "${title}" was successfully updated`,
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
      //     message: `Your payment status for "${title}" was successfully updated by admin`,
      //     role: "user",
      //     created_at: Date.now(),
      //   },
      //   {
      //     _id: notification[1]?._id,
      //     user_id,
      //     status: "unread",
      //     message: `Payment status for "${title}" was successfully updated`,
      //     role: "admin",
      //     created_at: Date.now(),
      //   },
      // ]);

      return NextResponse.json(
        { message: "Data successfully updated" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to update data" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
