import { Request, Response } from "express";
import { imagekit } from "../constants.js";

export async function deleteImageKitFile(fileId: string) {
  try {
    imagekit.deleteFile(fileId, function (error) {
      if (error) {
        console.log(error);
      } else {
        return { message: "file deleted" };
      }
    });
  } catch (error) {
    console.log(error);
    return { error: error?.toString() };
  }
}
export async function deleteImageKitFileRoute(req: Request, res: Response) {
  const fileId = req?.body?.fileId;
  try {
    const response = await deleteImageKitFile(fileId);
    return res.json(response);
  } catch (error) {
    console.log(error);
    return res.json({ error: error?.toString() });
  }
}
