import { useState } from "react";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(
    Array.isArray(post.likes_count) ? post.likes_count : [],
  );
  const postWithHashtags = post.content?.replace(
    /(#\w+)/g,
    '<span class="text-indigo-400">$1</span>',
  );

  const handleLike = () =>{
    }
  const currentUser = {
    _id: "123",
    username: "MyUser",
    profile_picture: "/default-profile.png",
  };
  return (
    <div className="bg-[#182034] text-white rounded-xl shadow-ms p-4 space-y-3 w-full max-w-2xl">
      <div
        onClick={() => post.user && navigate("/profile/" + post.user._id)}
        className="flex items-center gap-3 cursor-pointer"
      >
        <img
          src={post.user?.prohile_picture || ""}
          alt=""
          className="w-10 h-10 rounded-full shadow-ms"
        />
        <div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-white">
              {post.user?.full_name || ""}
            </span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-gray-400 text-sm">
            @{post.user?.username || ""} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* post content */}
      {post.content && (
        <div
          className="text-gray-200 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        ></div>
      )}

      {/* post Images */}
      {Array.isArray(post.image_urls) && post.image_urls.length > 0 && (
        <div
          className={`grid gap-2 ${post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"} max-h-[300px] overflow-hidden`}
        >
          {post.image_urls.map((img, index) => (
            <img
              key={index}
              src={img}
              className={`w-full object-cover rounded-lg ${post.image_urls.length === 1 ? "h-48 md:h-64" : "h-36 md:h-48"}`}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-400 text-sm border-t border-gray-700 pt-3">
        <div
          className="flex items-center gap-1 cursor-pointer "
          onClick={handleLike}
        >
          <Heart
            className={`w-5 h-5 ${likes.includes(currentUser?._id) ? "text-red-500 fill-red-500" : ""}`}
          />
          <span>{likes.length}</span>س
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments?.length || 0}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <Share2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
