import mongoose, { Mongoose, Schema } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sendId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
