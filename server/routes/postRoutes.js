import express from "express";
import  upload  from "../config/multer.js";
import { protect } from "../middleware/auth.js";
import {
  addComment,
  addPost,
  getFeedPosts,
  getSinglePost,
  getUserPosts,
  likePost,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), protect, addPost);
postRouter.get("/feed", protect, getFeedPosts);
postRouter.post("/like", protect, likePost);

postRouter.get("/:postId", protect, getSinglePost);
postRouter.post("/:postId/comment", protect, addComment);

postRouter.get("/user/:id", getUserPosts);

export default postRouter;
