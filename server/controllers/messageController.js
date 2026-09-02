import fs from "fs";
import imageKit from "../config/imageKit.js";

import Message from "../models/Message.js";

const connections = {};

export const sseController = (req, res) => {
  const { userId } = req.params;

  //Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  connections[userId] = res;
  res.write("log: Connected to SSE stream\n\n");
  res.on("close", () => {
    delete connections[userId];
    console.log("Client disconnected");
  });
};

//Send Message
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const image = req.file;

    let media_url = "";
    let message_type = image ? "image" : "text";

    if (message_type === "image" && image) {
      const fileBuffer = fs.readFileSync(image.path);
      const response = await imageKit.upload({
        file: fileBuffer,
        fileName: image.originalname,
        folder: "messages",
      });
      if (response && response.filePath) {
        media_url = imageKit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1290" },
          ],
        });
      }
    }

    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      message_type,
      media_url,
    });

    // Send SSE event to recipient if connected
    if (connections[to_user_id]) {
      connections[to_user_id].write(`data: ${JSON.stringify(message)}\n\n`);
    }

    res.json({ success: true, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get Chat Messages

export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;
    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    }).sort({ createdAt: -1 });

    await Message.updateMany(
      { from_user_id: to_user_id, to_user_id: userId, seen: false },
      { seen: true },
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const messages = await Message.find({
      $or: [{ from_user_id: userId }, { to_user_id: userId }],
    })
      .populate("from_user_id to_user_id")
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ======== Block User ========

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { userIdToBlock } = req.body;
    const currentUser = await User.findById(userId);
    if (!currentUser.blockedUsers.includes(userIdToBlock)) {
      currentUser.blockedUsers.push(userIdToBlock);
      await currentUser.save();
    }
    return res.json({
      success: true,
      message: "User blocked successfully",
      blockedUsers: currentUser.blockedUsers,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ======== Unblock User ========

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { userIdToUnblock } = req.body;
    const currentUser = await User.findById(userId);
    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (id) => String(id) !== String(userIdToUnblock),
    );
    await currentUser.save();
    return res.json({
      success: true,
      message: "User unblocked successfully",
      blockedUsers: currentUser.blockedUsers,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
