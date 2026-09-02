import Group from "../models/groupModel.js";
import GroupMessage from "../models/groupMessage.js";

export const createGroup = async (req, res) => {
  try {
    const { name, owner } = req.body;
    const group = await Group.create({
      name,
      owner,
      members: [{ userId: owner, status: "accepted" }],
    });
    res.json(group);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const getAvailableGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ error: "group not found" });
    const alreadyMember = group.members.find((m) => m.userId === userId);
    if (alreadyMember)
      return res.status(400).json({ error: "Already requested or member" });
    group.members.push({ userId, status: "pending" });
    await group.save();
    res.status(200).json({ message: "Request sent." });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const getGroupRequests = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    const pendingRequests = group.members.filter((m) => m.status === "pending");
    res.json(pendingRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const acceptMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    const member = group.members.find((m) => m.userId === userId);
    if (!member) return res.status(404).json({ error: "Member not found" });
    member.status = "accepted";
    await group.save();
    res.json({ message: "Member accepted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const messages = await GroupMessage.find({ groupId: req.params.id });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const getJoinedGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({
      members: { $elemMatch: { userId: userId, status: "accepted" } },
    });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
