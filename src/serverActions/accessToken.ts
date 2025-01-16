import jwt from "jsonwebtoken";

export function accessTokenMake({ ...rest }) {
  const token = jwt.sign(
    { ...rest },
    process.env.NEXT_PUBLIC_JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return token;
}
