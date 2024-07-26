import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { io } from "../socket/socket.js";

export const createConversation = async (req: Request, res: Response) => {
  const type = req?.body?.type;
  const members = req?.body?.members;
  try {
    const conversation = await prisma.conversation.create({
      data: {
        type: type,
        members: {
          create: members?.map((user: any) => ({ userId: user?.id })),
        },
        groupTitle: req?.body?.groupTitle,
        isGroup: req?.body?.isGroup,
      },
      include: { members: { include: { user: true } } },
    });
    conversation?.members?.forEach((member: { userId: any; }) => {
      io.to(member?.userId).emit("newConversation", conversation);
    });
    return res.json(conversation);
  } catch (error) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  const userId = req?.user?.id;
  const searchValue = req?.body?.searchValue;
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        AND: [{ members: { some: { userId } } }],
        OR: searchValue
          ? [
              { groupTitle: { contains: searchValue, mode: "insensitive" } },
              {
                members: {
                  some: {
                    user: {
                      name: { contains: searchValue, mode: "insensitive" },
                    },
                  },
                },
              },
              {
                members: {
                  some: {
                    user: {
                      email: { contains: searchValue, mode: "insensitive" },
                    },
                  },
                },
              },
            ]
          : undefined,
      },
      include: { members: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.json(conversations);
  } catch (error) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  const member = await prisma.member.findFirst({
    where: {
      AND: [
        { conversationId: req?.body?.conversationId, userId: req?.user?.id },
      ],
    },
  });
  if (!member) {
    return { message: "You are not allowed to delete this conversation" };
  }
  try {
    const conversation = await prisma.conversation.delete({
      where: { id: req?.body?.conversationId },
      include: { members: { include: { user: true } } },
    });
    conversation?.members?.forEach((member: { userId: any; }) => {
      io.to(member?.userId).emit("deleteConversation", conversation?.id);
    });
    return res.json(conversation);
  } catch (error) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
};
