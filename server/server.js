import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDb from "./config/ConnectDb.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(clerkMiddleware());

// مسار Inngest الأساسي لاستقبال إيفنتات Clerk وتوثيقها تلقائياً
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

app.get("/", (req, res) => {
  res.send("hello in world with bassem");
});

ConnectDb().catch(console.error);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
