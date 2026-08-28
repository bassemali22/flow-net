import { Inngest } from "inngest";
import User from "../models/User.js";
import connectDb from "../config/ConnectDb.js";

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

    // Make sure username is unique
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

// =========================
// Export Functions
// =========================
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
