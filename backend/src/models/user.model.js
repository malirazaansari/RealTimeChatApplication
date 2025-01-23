import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    firebaseId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: {
        validator: function (v) {
          // Regex for strong password: at least 1 uppercase, 1 lowercase, and 1 digit
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(v);
        },
        message: (props) => `${props.value} is not a strong enough password!`,
      },
    },
    profilePic: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
