import { Inngest } from "inngest";
import User from "../models/User.js";
import connectDb from "../config/ConnectDb.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";

export const inngest = new Inngest({
  id: "my-app",
});

// =========================
// Create User
// =========================
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    await connectDb();
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const email = email_addresses?.[0]?.email_address;

    if (!email) {
      throw new Error("User email is missing");
    }

    let username = email.split("@")[0];

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      username = `${username}${Math.floor(Math.random() * 10000)}`;
    }

    await User.create({
      _id: id,
      username,
      email,
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: image_url || "",
    });
  },
);

// =========================
// Update User
// =========================
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    await connectDb();
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const email = email_addresses?.[0]?.email_address;

    if (!email) {
      throw new Error("User email is missing");
    }

    await User.findByIdAndUpdate(
      id,
      {
        email,
        full_name: `${first_name || ""} ${last_name || ""}`.trim(),
        profile_picture: image_url || "",
      },
      {
        new: true,
      },
    );
  },
);

// =========================
// Delete User
// =========================
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    await connectDb();
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  },
);

const sendNewConnectionRequestReminder = inngest.createFunction(
  { id: "send-new-connection-request-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-new-connection-request-mail", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id",
      );
      const subject = `New Connection Request`;
      const body = `<div style="font-family:Arial, sans-serif; padding:20px;">
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <p>You have a new connection request from ${connection.from_user_id.full_name} 
            - @${connection.from_user_id.username}</p>
            <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a>
            to accept or reject the request</p>
            <br/>
            <p>Thanks , <br/>Postly - Stay Connected</p>
            </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24-hours", in24Hours);

    await step.run("send_connection_request_reminder", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id",
      );
      if (connection.status === "accepted") {
        return { message: "Already accepted" };
      }
      const subject = `New Connection Request`;
      const body = `<div style="font-family:Arial, sans-serif; padding:20px;">
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <p>You have a new connection request from ${connection.from_user_id.full_name} 
            - @${connection.from_user_id.username}</p>
            <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a>
            to accept or reject the request</p>
            <br/>
            <p>Thanks , <br/>Postly - Stay Connected</p>
            </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
      return { message: "Remindeder send" };
    });
  },
);

const deleteStory = inngest.createFunction(
  { id: "story-delete" },
  { event: "app/story.delete" },
  async ({ event, step }) => {
    const { storyId } = event.data;
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24-hours", in24Hours);
    await step.run("delete-story", async () => {
      await Story.findByIdAndDelete(storyId);
      return { message: "Story deleted." };
    });
  },
);

const sendNotificationOfUnseenMessages = inngest.createFunction(
  {
    id: "send-unseen-messages-notification",
    cron: "TZ=America/New_York 0 9 * * *",
  },
  async ({ step }) => {
    const messages = await Message.find({ seen: false }).populate("to_user_id");
    const unseenCount = {};
    messages.map((message) => {
      const userId = message.to_user_id._id.toString();
      unseenCount[userId] = (unseenCount[userId] || 0) + 1;
    });
    for (const userId in unseenCount) {
      const user = await User.findById(userId);
      const subject = `You have ${unseenCount[userId]} unseen messages`;
      const body = `
            <div style="font-family:Arial, sans-serif; padding:20px;">
            <h2>Hi ${user.full_name},</h2>
            <p>You have ${unseenCount[userId]} unseen messages</p>
            <p>Click <a href="${process.env.FRONTEND_URL}/messages" style="color:#10b981;">here</a> to view them</p>
            <br/>
            <p>Thanks , <br/>Postly - Stay Connected</p>
            </div>
            `;
      await sendEmail({
        to: user.email,
        subject,
        body,
      });
    }
  },
);
// =========================
// Export Functions
// =========================
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionRequestReminder,
  sendNotificationOfUnseenMessages,
  deleteStory,
];
