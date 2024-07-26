import { Socket } from "socket.io";
import { joinRoom, leaveRoom } from "./room.js";
import { io } from "./socket.js";

export const handleEvents = (socket: Socket) => {
  socket.on("joinConversation", (conversationId: string) => {
    joinRoom(socket, conversationId);
    io.to(conversationId).emit(
      "onlineUsersNumberForGroupChats",
      io?.sockets?.adapter?.rooms?.get(conversationId)?.size
    );
  });
  socket.on("leaveConversation", (conversationId: string) => {
    leaveRoom(socket, conversationId);
    io.to(conversationId).emit(
      "onlineUsersNumberForGroupChats",
      io?.sockets?.adapter?.rooms?.get(conversationId)?.size
    );
  });
  socket.on("connectedUser", (userId: string) => {
    console.log("connectedUser");
    joinRoom(socket, userId);
  });
  socket.on("disconnectedUser", (userId: string) => {
    console.log("disconnectedUser");
    leaveRoom(socket, userId);
  });
};
