import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  const socketId = userSocketMap[userId];
  if (!socketId) {
    console.warn(`Socket ID not found for user ${userId}`);
  }
  return socketId;
}

const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  console.log("Socket handshake query:", socket.handshake.query);
  const userId = socket.handshake.query.userId;

  if (!userId || userId === "undefined") {
    console.warn("No userId provided in handshake query");
    return;
  }

  userSocketMap[userId] = socket.id;
  console.log(`User ${userId} connected with socket ID ${socket.id}`);
  console.log("Current userSocketMap:", userSocketMap);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId });
    }
  });

  socket.on("readMessage", async ({ messageId, senderId }) => {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      console.error(`Invalid messageId: ${messageId}`);
      return;
    }
    await Message.findByIdAndUpdate(messageId, { status: "read" });

    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageRead", { messageId });
    }
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    if (userId) {
      delete userSocketMap[userId];
      console.log(`User ${userId} disconnected`);
    } else {
      console.warn(`No userId found for disconnected socket ${socket.id}`);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
