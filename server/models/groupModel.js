import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
});

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: String, required: true },
    members: [memberSchema],
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
