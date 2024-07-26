import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { io } from "../socket/socket.js";
import { deleteImageKitFile } from "../utils/deleteImageKitFile.js";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req?.body?.conversationId },
      include: {
        sender: {
          include: {
            user: {
              select: { id: true, imageUrl: true, email: true, name: true },
            },
          },
        },
      },
    });
    return res.json(messages);
  } catch (error) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
};
export const createMessage = async (req: Request, res: Response) => {
  try {
    const message = await prisma.message.create({
      data: {
        ...req?.body?.messageBody,
        sender: { connect: { id: req?.body?.senderId } },
        conversation: { connect: { id: req?.body?.conversationId } },
      },
      include: {
        sender: {
          include: {
            user: { select: { id: true, imageUrl: true, email: true } },
          },
        },
      },
    });
    io.to(req?.body?.conversationId).emit("newMessage", message);
    const members = await prisma.member.findMany({
      where: { conversationId: req?.body?.conversationId },
    });
    members.forEach((member) => {
      io.to(member?.userId).emit("newMessageInConversation", message);
    });
    return res.json(message);
  } catch (error: any) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
};
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const message = await prisma.message.findFirst({
      where: { id: req?.body?.message?.id },
      include: {
        conversation: {
          include: { members: { include: { user: { select: { id: true } } } } },
        },
      },
    });
    const member = await prisma.member.findFirst({
      where: { id: message?.senderId },
    });
    if (member?.userId === req?.user?.id) {
      await prisma.message.delete({ where: { id: req?.body?.message?.id } });
      if (message?.fileId) {
        await deleteImageKitFile(message?.fileId);
      }
      io.to(req?.body?.message?.conversationId).emit(
        "deletedMessage",
        message?.id
      );
      return res.json(message);
    } else {
      return res.json({
        message: "You are not allowed to delete this message",
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
};
