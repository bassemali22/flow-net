import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDb from "./config/ConnectDb.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
dotenv.config();

const app = express();

// 1. تفعيل الـ CORS والـ JSON
app.use(express.json());
app.use(cors());

// 2. تفعيل Middleware الخاص بـ Clerk
app.use(clerkMiddleware());

// 3. ربط مسار Inngest
app.use("/api/inngest", serve({ client: inngest, functions }));

// 4. راوت التجربة
app.get("/", (req, res) => {
  res.send("hello in world with bassem");
});

// 5. الاتصال بقاعدة البيانات لـ Vercel Serverless
ConnectDb().catch(console.error);

// 6. تشغيل السيرفر محلياً (لو مش شغال في بيئة الإنتاج على Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  const startServer = async () => {
    try {
      await ConnectDb();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server due to DB connection error:", error);
    }
  };
  startServer();
}

// 7. التصدير الأساسي الذي تطلبه منصة Vercel
export default app;