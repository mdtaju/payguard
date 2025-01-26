import { createMongoConnection } from "@/config/mongodb";
import { accessTokenCheck } from "@/lib/accessTokenCheck";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {
      file_url = "",
      name = "",
      update_type,
    }: {
      name: string;
      file_url: string;
      update_type: string;
    } = await request.json();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    accessTokenCheck(token as string);

    await createMongoConnection();

    let user;

    if (update_type === "name") {
      user = await User.updateOne({ id }, { $set: { name } });
    } else {
      user = await User.updateOne({ id }, { $set: { photo_url: file_url } });
    }
    if (user?.modifiedCount) {
      return NextResponse.json(
        { message: "Data successfully updated", status: 200 },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to update data" },
        { status: 400 }
      );
    }
  } catch (error) {
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
