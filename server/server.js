import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import ConnectDb from "./config/ConnectDb.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRputes.js";

const app = express();

// 1. إعدادات الـ Middleware الأساسية أولاً
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// 2. مسارات الاختبار
app.get("/test", (req, res) => {
  console.log("🔥 TEST HIT");
  res.status(200).json({
    message: "Server is working",
  });
});

app.get("/", (req, res) => {
  res.send("hello in world with bassem");
});

// 3. مسارات التطبيق
app.use("/api/user", userRouter);
app.use("api/post", postRouter);
app.use("api/stroies", storyRouter);

// 4. مسار Inngest (يُكتب مرة واحدة فقط بالشكل الصحيح بعد الـ Middleware)
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

// 5. الاتصال بقاعدة البيانات وتشغيل السيرفر محلياً
ConnectDb().catch(console.error);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
