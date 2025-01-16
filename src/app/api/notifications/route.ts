import { createMongoConnection } from "@/config/mongodb";
import { accessTokenCheck } from "@/lib/accessTokenCheck";
import Notification from "@/models/notificationModal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, user_id }: { message: string; user_id: string } =
      await request.json();

    const authToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    accessTokenCheck(authToken as string);
    await createMongoConnection();

    const res = await Notification.insertMany([
      { message, user_id, created_at: Date.now() },
    ]);

    const notification = Response.json(res);

    // redirecting to message page as successfully signup
    if (notification?.ok) {
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
