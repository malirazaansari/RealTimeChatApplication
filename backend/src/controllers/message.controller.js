import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggesInUserId = req.user.id;
    const filteredUsers = await User.find({
      _id: { $ne: loggesInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSideBar", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const myObjectId = new mongoose.Types.ObjectId(myId);
    const chatPartnerObjectId = new mongoose.Types.ObjectId(userToChatId);

    console.log("Logged-in User ID:", myObjectId);
    console.log("Chat Partner ID:", chatPartnerObjectId);

    const query = {
      $or: [
        { sendId: myObjectId, receiverId: chatPartnerObjectId },
        { sendId: chatPartnerObjectId, receiverId: myObjectId },
      ],
    };

    console.log("Query:", query);

    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find(query)
      .sort({ createdAt: "asc" })
      .skip((page - 1) * limit)
      .limit(limit);
    console.log("Messages Found:", messages);

    if (messages.length === 0) {
      console.warn("No messages found for the given users.");
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request params:", req.params);
    console.log("Authenticated user:", req.user);

    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const sendId = req.user?._id;

    if (!sendId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }
    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid recipient ID" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Recipient user not found" });
    }

    if (!text && (!image || image === "null")) {
      return res
        .status(400)
        .json({ error: "Message text or image is required" });
    }

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid recipient ID" });
    }

    if (!sendId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    let imageUrl;
    if (image && image !== "null") {
      try {
        console.log("Uploading image...");
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError.message);
        return res.status(500).json({ error: "Image upload failed" });
      }
    } else {
      console.log("No valid image provided for upload.");
    }

    console.log("Creating new message...");
    const newMessage = new Message({
      text,
      sendId,
      receiverId,
      image: imageUrl,
    });

    await newMessage.save();
    console.log("Message saved successfully:", newMessage);

    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("Receiver Socket ID:", receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage, (ack) => {
        if (ack) {
          console.log(`Message delivered to user ${receiverId} through socket`);
        } else {
          console.warn(`Failed to deliver message to user ${receiverId}`);
        }
      });
    } else {
      console.warn(`No socket connection found for user ${receiverId}`);
      newMessage.status = "undelivered";
      await newMessage.save();
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error in sending message from here" });
  }
};
