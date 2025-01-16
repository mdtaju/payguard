import { createMongoConnection } from "@/config/mongodb";
import Document from "@/models/documentModel";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const { status }: { status: string } = await req.json();
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

    const document = await Document.updateOne(
      { _id: id },
      { $set: { status } }
    );

    if (document.modifiedCount) {
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
