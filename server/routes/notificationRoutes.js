import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getUserNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", requireAuth, getUserNotifications);
router.post("/read", requireAuth, markNotificationRead);

export default router;
