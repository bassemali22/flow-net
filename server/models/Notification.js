import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    from_user: { type: String, required: true },
    type: { type: String, enum: ["like", "comment", "media"], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    commentText: { type: String, default: null },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
