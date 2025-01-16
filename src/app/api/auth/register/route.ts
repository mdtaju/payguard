import bcrypt from "bcrypt";

export default async function POST(req: Request) {
  const authToken = req.headers.get("authorization")?.replace("Bearer ", "");

  const formData = await req.formData();
  const name = await formData.get("full_name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  const hashedPassword = await bcrypt.hash(password as string, 10);
}
