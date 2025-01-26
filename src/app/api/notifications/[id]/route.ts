import { createMongoConnection } from "@/config/mongodb";
import { accessTokenCheck } from "@/lib/accessTokenCheck";
import Notification from "@/models/notificationModal";
import { NotificationType } from "@/types/allTypes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      startIndex,
      totalDataCount,
    }: { startIndex: number; totalDataCount: number } = await req.json();
    const { id } = await params;
    const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const [role] = accessTokenCheck(authToken as string);

    await createMongoConnection();

    let data: NotificationType[] = [];
    let totalNotifications;
    if (role === "admin") {
      data = await Notification.find({ role })
        .sort({ created_at: 1 })
        .skip(startIndex)
        .limit(totalDataCount)
        .sort({ created_at: -1 })
        .exec();
      totalNotifications = await Notification.find({ role })
        .countDocuments()
        .exec();
    } else {
      data = await Notification.find({ user_id: id, role })
        .sort({ created_at: 1 })
        .skip(startIndex)
        .limit(totalDataCount)
        .sort({ created_at: -1 })
        .exec();
      totalNotifications = await Notification.find({ user_id: id, role })
        .countDocuments()
        .exec();
    }
    if (data) {
      return NextResponse.json(
        {
          message: "Data fetch success for user",
          result: { data, totalCount: totalNotifications },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "data not found" }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const { id } = await params;

    accessTokenCheck(authToken as string);

    await createMongoConnection();

    const notification = await Notification.updateOne(
      { _id: id },
      { $set: { status: "read" } }
    );

    if (notification.modifiedCount) {
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
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
