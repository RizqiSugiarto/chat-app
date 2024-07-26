import { JWT_SECRET_KEY } from "../constants.js";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";
export default async function ioMiddleware(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) {
  const token = socket.handshake.auth.token ?? "";
  let verifiedToken;
  try {
    verifiedToken = await jwt.verify(token, JWT_SECRET_KEY);

    if (!verifiedToken) {
      const err = new Error("Token expired");
      next(err);
    }
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
}
