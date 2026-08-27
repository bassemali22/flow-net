import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDb from "./config/ConnectDb.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";

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

// 2. تفعيل الـ JSON لباقي الراوتات العادية
app.use(express.json());

// 3. راوت التجربة
app.get("/", (req, res) => {
  res.send("hello in world with bassem");
});

// 4. الاتصال بقاعدة البيانات لـ Vercel Serverless
ConnectDb().catch(console.error);

// 5. تشغيل السيرفر محلياً
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
