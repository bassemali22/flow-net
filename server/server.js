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
import messageRouter from "./routes/messageRoutes.js";
import { getUserNotifications } from "./controllers/notificationController.js";
import { createServer } from "http";
import { Server } from "socket.io";
import groupRouter from "./routes/groupRoutes.js";
const app = express();
app.use(cors());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  origin: "*",
  methods: ["GET", "POST"],
});

// 1. إعدادات الـ Middleware الأساسية أولاً
app.use(express.json());
app.use(clerkMiddleware());

// 2. مسارات الاختبار
app.get("/test", (req, res) => {
  console.log("bassem");
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
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);
app.use("/api/notifications", getUserNotifications);
app.use("/api/group", groupRouter);
io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join", ({ groupId, userId }) => {
    socket.join(groupId);
    console.log(`${userId}`);
  });

  socket.on("send_message", async ({ groupId, sender, text }) => {
    const Message = (await import("./models/groupMessageModel.js")).default;
    const newMsg = await Message.create({ groupId, sender, text });
    io.to(groupId).emit("receive_message", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

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

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
