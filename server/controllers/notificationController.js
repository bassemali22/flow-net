import Notification from "../models/Notification.js";
import User from "../models/User.js";

const getUserData = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select("_id full_name username profile_picture")
      .lean();

    if (!user) {
      return {
        _id: "",
        full_name: "Unknown",
        username: "Unknown",
        profile_picture: "/default.png",
      };
    }
    return user;
  } catch (error) {
    console.log("Error fetching user data:", error);
    return {
      _id: "",
      full_name: "Unknown",
      username: "Unknown",
      profile_picture: "/default.png",
    };
  }
};

// ======== CREATE NOTIFICATION ========

export const createNotification = async ({
  userId,
  fromUserId,
  type,
  postId = null,
  commentText = null,
}) => {
  try {
    console.log('first')
    if (!userId || !fromUserId || !type)
      throw new Error("Missing required fields for notification");
    const notification = await Notification.create({
      user: userId,
      from_user: fromUserId,
      type: type.toLowerCase(),
      post: postId,
      commentText,
    });
    return notification;
  } catch (error) {
    console.error("Notification creation error", error);
  }
};

// ======== GET USER NOTIFICATIONS ========

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.auth();
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    const notificationsWithUser = await Promise.all(
      notifications.map(async (n) => {
        const fromUserData = await getUserData(n.from_user);
        return {
          ...n,
          from_user: fromUserData,
          type: n.type?.toLowerCase() || "unknown",
          commentText: n.commentText || "",
        };
      }),
    );
    res.json({ success: true, notifications: notificationsWithUser });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======== MARK NOTIFICATION AS READ ========

export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId)
      return res
        .status(400)
        .json({ success: false, message: "notificationId is required" });
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    ).lean();
    const fromUserData = await getUserData(notification.from_user);
    res.json({
      success: true,
      notification: { ...notification, from_user: fromUserData },
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
