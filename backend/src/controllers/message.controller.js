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
    const { id: userToChatId } = req.params; // Chat partner ID
    const myId = req.user._id; // Logged-in user's ID

    // Convert IDs to ObjectId to make sure we compare them correctly
    const myObjectId = new mongoose.Types.ObjectId(myId);
    const chatPartnerObjectId = new mongoose.Types.ObjectId(userToChatId);

    console.log("Logged-in User ID:", myObjectId);
    console.log("Chat Partner ID:", chatPartnerObjectId);

    // Updated query with the correct field names (`sendId` and `receiverId`)
    const query = {
      $or: [
        { sendId: myObjectId, receiverId: chatPartnerObjectId },
        { sendId: chatPartnerObjectId, receiverId: myObjectId },
      ],
    };

    console.log("Query:", query);

    // Fetch messages from the database
    const messages = await Message.find(query).sort({ createdAt: "asc" });
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
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      console.log(`Sent new message to user ${receiverId} through socket`);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error in sending message from here" });
  }
};
