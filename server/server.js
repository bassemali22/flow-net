import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import ConnectDb from "./config/ConnectDb.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.get("/test", (req, res) => {
  console.log("🔥 TEST HIT");
  res.status(200).json({
    message: "Server is working",
  });
});
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);


app.use(express.json());
app.use(clerkMiddleware());
app.use(cors());

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

app.use("/api/user", userRouter);

ConnectDb().catch(console.error);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
