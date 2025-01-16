import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({ message: "yes" });
}
export async function POST(req: Request) {
  try {
  } catch (error) {}
  return NextResponse.json({ message: "yes" });
}
