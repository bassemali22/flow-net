import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Webhook } from "svix";
import ConnectDb from "./config/ConnectDb.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

// تفعيل CORS أولاً لجميع المسارات
app.use(cors());

// 1. مسار Inngest
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

// 2. مسار استقبال الـ Webhook من Clerk وتوثيقه عبر Svix
app.post(
  "/api/clerk-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
      return res
        .status(500)
        .json({ error: "Please add CLERK_WEBHOOK_SECRET to env variables" });
    }

    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res
        .status(400)
        .json({ error: "Error occurred -- no svix headers" });
    }

    const body = req.body.toString();
    const wh = new Webhook(SIGNING_SECRET);
    let evt;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).json({ success: false, message: err.message });
    }

    const eventType = evt.type;

    // إرسال جميع الأحداث المدعومة (إنشاء، تحديث، وحذف) إلى Inngest
    if (
      eventType === "user.created" ||
      eventType === "user.updated" ||
      eventType === "user.deleted"
    ) {
      await inngest.send({
        name: `clerk/${eventType}`,
        data: evt.data,
      });
    }

    return res.status(200).json({ success: true, message: "Webhook received" });
  },
);

// 3. تفعيل الـ JSON لباقي الراوتات العادية
app.use(express.json());

// 4. تهيئة Clerk مع استثناء مسارات api لمنع تعارض الحماية
const clerk = clerkMiddleware();
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    return next();
  }
  return clerk(req, res, next);
});

// 5. راوت التجربة
app.get("/", (req, res) => {
  res.send("hello in world with bassem");
});

// 6. الاتصال بقاعدة البيانات لـ Vercel Serverless
ConnectDb().catch(console.error);

// 7. تشغيل السيرفر محلياً
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
