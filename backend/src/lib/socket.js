import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
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
  // console.log("Socket handshake query:", socket.handshake.query);
  const userId = socket.handshake.query.userId;

  if (!userId || userId === "undefined") {
    console.warn("No userId provided in handshake query");
    return;
  }

  userSocketMap[userId] = socket.id;
  // console.log(`User ${userId} connected with socket ID ${socket.id}`);
  // console.log("Current userSocketMap:", userSocketMap);
  console.log(
    `User ${userId} connected. Current userSocketMap:`,
    userSocketMap
  );

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  console.log(
    "Emitted getOnlineUsers event after connection:",
    Object.keys(userSocketMap)
  );

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
    try {
      if (!mongoose.Types.ObjectId.isValid(messageId)) {
        console.error(`Invalid messageId: ${messageId}`);
        return;
      }
      await Message.findByIdAndUpdate(messageId, { status: "read" });

      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageRead", { messageId });
      }
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  });
  socket.on("requestOnlineUsers", () => {
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("disconnect", () => {
    const disconnectedUserId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
      console.log(`User ${disconnectedUserId} disconnected`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update online users
    console.log(
      "Emitted getOnlineUsers event after disconnection:",
      Object.keys(userSocketMap)
    );
  });
});

export { io, app, server };
