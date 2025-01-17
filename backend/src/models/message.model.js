import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sendId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure at least one of `text` or `image` is provided
messageSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    next(new Error("A message must have either text or an image."));
  } else {
    next();
  }
});

// Indexes for better query performance
messageSchema.index({ sendId: 1 });
messageSchema.index({ receiverId: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
