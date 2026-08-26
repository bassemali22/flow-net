import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDb from "./config/ConnectDb.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
dotenv.config();

const app = express();

// 1. ربط مسار Inngest أولاً وقبل أي express.json لمنع تداخل الـ Body Parsing
app.use("/api/inngest", serve({ client: inngest, functions }));

// 2. تفعيل الـ CORS والـ JSON لباقي المسارات
app.use(express.json());
app.use(cors());

// 3. تفعيل Middleware الخاص بـ Clerk
app.use(clerkMiddleware());

// 4. راوت التجربة
app.get("/", (req, res) => {
  res.send("hello in world with bassem");
});

// 5. الاتصال بقاعدة البيانات لـ Vercel Serverless
ConnectDb().catch(console.error);

// 6. تشغيل السيرفر محلياً
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  const startServer = async () => {
    try {
      await ConnectDb();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error(
        "Failed to start server due to DB connection error:",
        error,
      );
    }
  };
  startServer();
}

// 7. التصدير الأساسي الذي تطلبه منصة Vercel
export default app;
