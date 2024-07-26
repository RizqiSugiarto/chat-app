import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { CLIENT_AUTH_URL, JWT_SECRET_KEY, NODE_ENV } from "../constants.js";
import { Request, Response } from "express";
export const signup = async (req: Request, res: Response) => {
  const { email, password, name, imageUrl = null } = req?.body;
  if (!email) {
    return res.json({ message: "Email is required" });
  }
  if (!password) {
    return res.json({ message: "Password is required" });
  }
  if (!name) {
    return res.json({ message: "Name is required" });
  }
  try {
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.json({ message: "Email is already in use" });
    }
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { email, name, imageUrl, password: hashedPassword },
      });

      res.cookie("token", await generateToken(newUser), {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        secure: NODE_ENV !== "dev",
        sameSite: NODE_ENV !== "dev" ? "none" : "lax",
        httpOnly: true,
      });
      return res.json({
        message: "Signed up successfully",
        user: {
          email: newUser?.email,
          id: newUser?.id,
          name: newUser?.name,
          imageUrl: newUser?.imageUrl,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req?.body;
  if (!email) {
    return res.json({ message: "Email is required" });
  }
  if (!password) {
    return res.json({ message: "Password is required" });
  }

  try {
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (!existingUser) {
      return res.json({ message: "Couldn't find the user" });
    }
    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser?.password
      );
      if (!isPasswordValid) {
        return res.json({ message: "Invalid password" });
      }
      console.log(NODE_ENV, "DAPET GINI")
      res.cookie("token", await generateToken(existingUser), {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV !== "dev" ? "none" : "lax",
        httpOnly: false,
      });
      return res.json({
        message: "Logged in successfully",
        user: {
          email: existingUser?.email,
          id: existingUser?.id,
          name: existingUser?.name,
          imageUrl: existingUser?.imageUrl,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
};
export const verifyUser = async (req: Request, res: Response) => {
  const cookies = req?.cookies;
  if (cookies?.token) {
    const decodedToken: any = jwt.verify(cookies.token, JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.redirect(CLIENT_AUTH_URL as string);
    }
    try {
      const existingUser = await prisma.user.findFirst({
        where: { email: decodedToken?.email },
      });
      if (!existingUser) {
        return res.redirect(CLIENT_AUTH_URL as string);
      }
      return res.json({
        isAuthenticated: true,
        user: {
          email: existingUser?.email,
          id: existingUser?.id,
          name: existingUser?.name,
          imageUrl: existingUser?.imageUrl,
        },
      });
    } catch (error) {
      console.log(error);
      return res.redirect(CLIENT_AUTH_URL as string);
    }
  }
};
