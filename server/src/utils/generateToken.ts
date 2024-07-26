import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants.js";
import { Prisma } from "@prisma/client";
export default async function generateToken(user: Prisma.UserCreateInput) {
  const token = jwt.sign(
    {
      email: user?.email,
      id: user?.id,
      name: user?.name,
      imageUrl: user?.imageUrl,
    },
    JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
}
