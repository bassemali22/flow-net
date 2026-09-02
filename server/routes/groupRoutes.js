import express from "express";
import {
  createGroup,
  joinGroup,
  acceptMember,
  getGroupMessages,
  getGroupRequests,
  getAvailableGroups,
  getJoinedGroups,
} from "../controllers/groupController.js";
import Group from "../models/groupModel.js";

const router = express.Router();

router.post("/", createGroup);
router.get("/available", getAvailableGroups);
router.get("/owned/:ownerId", async (req, res) => {
  try {
    const groups = await Group.find({ owner: req.params.ownerId });
    res.json({ groups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json({ group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/join", joinGroup);
router.get("/:id/requests", getGroupRequests);
router.post("/:id/accept", acceptMember);
router.get("/:id/messages", getGroupMessages);
router.get("/joined/:userId", getJoinedGroups);

export default router;
