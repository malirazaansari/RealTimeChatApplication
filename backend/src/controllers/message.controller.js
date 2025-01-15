import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";

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

    const messages = await Message.find({
      $or: [
        { sender: myId, recipient: userToChatId },
        { sender: userToChatId, recipient: myId },
      ],
    }).sort({ createdAt: "asc" });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request params:", req.params);
    console.log("Authenticated user:", req.user);

    const { text, image } = req.body;
    const { id: recipientId } = req.params; // `recipientId` is coming from the URL.
    const senderId = req.user?._id; // `senderId` is coming from the authenticated user.

    // Validate input
    if (!text && (!image || image === "null")) {
      return res
        .status(400)
        .json({ error: "Message text or image is required" });
    }

    if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ error: "Invalid recipient ID" });
    }

    if (!senderId) {
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
      senderId, // Match the schema field name
      receiverId: recipientId, // Match the schema field name
      image: imageUrl,
    });

    await newMessage.save();
    console.log("Message saved successfully:", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error in sending message from here" });
  }
};
