import express from "express";
import { imagekit } from "../constants.js";
import { deleteImageKitFileRoute } from "../utils/deleteImageKitFile.js";

const imageKitAuthController = express.Router();

imageKitAuthController.get("/auth", function (_req, res) {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});
imageKitAuthController.delete("/delete", deleteImageKitFileRoute);
export default imageKitAuthController;
