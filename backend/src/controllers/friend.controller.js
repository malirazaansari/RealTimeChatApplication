import Friend from "../models/friend.model.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if the request already exists
    const existingRequest = await Friend.findOne({
      sender: senderId,
      receiver: receiverId,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friendRequest = new Friend({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    await friendRequest.save();
    res
      .status(201)
      .json({ message: "Friend request sent successfully", friendRequest });
  } catch (error) {
    res.status(500).json({ message: "Error sending friend request", error });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const friendRequest = await Friend.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each other to their friends lists
    await User.findByIdAndUpdate(friendRequest.sender, {
      $push: { friends: friendRequest.receiver },
    });
    await User.findByIdAndUpdate(friendRequest.receiver, {
      $push: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted", friendRequest });
  } catch (error) {
    res.status(500).json({ message: "Error accepting friend request", error });
  }
};

export const getFriendsList = async (req, res) => {
  try {
    const userId = req.params.userId;

    const friends = await Friend.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: "accepted",
    }).populate("sender receiver", "name email profilePic");

    res.status(200).json({ friends });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friends list", error });
  }
};
