import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || mongoose.model("User", UserSchema);

export default User;