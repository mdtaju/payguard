import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function accessTokenCheck(authToken: string) {
  if (!authToken) {
    NextResponse.json(
      { message: "Unauthorized access", result: [] },
      { status: 401 }
    );
  }

  const decodedData = jwt.verify(
    authToken as string,
    process.env.NEXT_PUBLIC_JWT_SECRET as string
  );

  if (!decodedData) {
    NextResponse.json(
      { message: "Unauthorized access", result: [] },
      { status: 401 }
    );
  }
  const { role, id = "" } = decodedData as { role: string; id?: string };
  return [role, id];
}
