import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    status: {
  type: String,
  default: "sent",
},
  },
  {
    timestamps: true,
  }
);

const Message =
  models.Message || mongoose.model("Message", MessageSchema);

export default Message;