import { createMongoConnection } from "@/config/mongodb";
import { accessTokenCheck } from "@/lib/accessTokenCheck";
import Document from "@/models/documentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const [role, user_id] = accessTokenCheck(authToken as string);

    await createMongoConnection();
    switch (role) {
      case "admin":
        const dataForAdmin = await Document.find();
        return NextResponse.json(
          { message: "Data fetch success for admin", result: dataForAdmin },
          { status: 200 }
        );
      case "user":
        const data = await Document.find({ user_id });
        return NextResponse.json(
          { message: "Data fetch success for user", result: data },
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
      file_url,
      user_id,
    }: { title: string; file_url: string; user_id: string } =
      await request.json();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    accessTokenCheck(token as string);

    await createMongoConnection();

    const res = await Document.insertMany([
      { title, file_url, status: "pending", user_id, uploaded_at: Date.now() },
    ]);

    const document = Response.json(res);

    // redirecting to message page as successfully signup
    if (document?.ok) {
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
