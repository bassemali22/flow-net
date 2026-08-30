import imageKit from "../configs/imageKit.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

const getUserData = async (userId) => {
  return (
    (await User.findById(userId)
      .select("_id full_name username profile_picture")
      .lean()) || {
      _id: "",
      full_name: "Unknown",
      username: "Unknown",
      profile_picture: "",
    }
  );
};

const populatePostData = async (post) => {
  const user = await getUserData(post.user);

  const commentsWithUser = await Promise.all(
    post.comments.map(async (c) => {
      const commentUser = await getUserData(c.user);
      return { ...c.toObject(), user: commentUser };
    }),
  );
  return { ...post.toObject(), user, comments: commentsWithUser };
};

export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;

    let image_urls = [];
    if (req.files && req.files.length) {
      image_urls = await Promise.all(
        req.files.map(async (file) => {
          const fileBuffer = fs.readFileSync(file.path);
          const response = await imageKit.upload({
            file: fileBuffer,
            fileName: file.originalname,
            folder: "posts",
          });
          return imageKit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });
        }),
      );
    }

    const post = await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });
    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.auth();
    const currentUser = await User.findById(userId).select("blockedUsers");
    const blockedByMe = currentUser?.blockedUsers?.map(String) || [];

    const excludeIds = [...blockedByMe, userId];

    const posts = await Post.find({
      user: { $nin: excludeIds },
    }).sort({ createdAt: -1 });

    const postsWithUserData = await Promise.all(
      posts.map(async (post) => await populatePostData(post)),
    );

    res.json({ success: true, posts: postsWithUserData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    const postsWithUserData = await Promise.all(posts.map(populatePostData));
    res.json({ success: true, posts: postsWithUserData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======== LIKE / UNLIKE POST ========

export const likePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    if (!Array.isArray(post.likes_count)) post.likes_count = [];
    const isLiked = post.likes_count.includes(userId);
    if (isLiked) {
      post.likes_count = post.likes_count.filter((id) => id !== userId);
    } else {
      post.likes_count.push(userId);
      if (post.user !== userId) {
        await createNotification({
          userId: post.user,
          fromUserId: userId,
          type: "like",
          postId: post._id,
        });
      }
    }
    await post.save();
    res.json({
      success: true,
      message: isLiked ? "Post unliked" : "Post liked",
      likes_count: post.likes_count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======== GET SINGLE POST ========

export const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const postWithUser = await populatePostData(post);
    res.json({ success: true, post: postWithUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Add Comment

export const addComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.params;
    const { text } = req.body;

    if (!text.trim())
      return res
        .status(400)
        .json({ success: false, message: "Comment text is required" });
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    post.comments.push({ user: userId, text });
    await post.save();
    if (post.user !== userId) {
      await createNotification({
        userId: post.user,
        fromUserId: userId,
        type: "comment",
        postId: post._id,
        commentText: text,
      });
    }
    const postWithUser = await populatePostData(post);
    res.json({ success: true, message: "Comment added", post: postWithUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ user: id })
      .sort({ createdAt: -1 })
      .populate("user", "_id full_name username profile_picture");
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
