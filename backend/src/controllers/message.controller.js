import User from "../models/user.model";
import Message from "../models/message.model.js";
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
    const { text, image } = req.body;
    const { id: recipientId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      text,
      senderId,
      recipientId,
      image: imageUrl,
    });

    await newMessage.save();

    // todo realtime functionality foes here => socket.io
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
