import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDb from "./config/ConnectDb.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
dotenv.config();

const app = express();

// 1. تفعيل الـ CORS بشكل صحيح
app.use(express.json());
app.use(cors());
// 2. تفعيل قراءة الـ JSON من الطلبات
app.use(clerkMiddleware);

// 3. ربط مسار Inngest بالشكل الصحيح (مع إضافة الشرطة المائلة /)
app.use("/api/inngest", serve({ client: inngest, functions }));

// 4. راوت التجربة
app.get("/", (req, res) => {
  res.send("hello in world with bassem");
});

const PORT = process.env.PORT || 4000;

// 5. الاتصال بقاعدة البيانات ثم تشغيل السيرفر
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
