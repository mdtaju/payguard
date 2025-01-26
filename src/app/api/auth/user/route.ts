import { createMongoConnection } from "@/config/mongodb";
import { accessTokenCheck } from "@/lib/accessTokenCheck";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [role, id] = accessTokenCheck(authToken as string);

    await createMongoConnection();

    const data = await User.find({ id });
    if (data) {
      return NextResponse.json(
        { message: "Data fetch success for user", result: data },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "data not found" }, { status: 404 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
