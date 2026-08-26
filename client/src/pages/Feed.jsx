import Loading from "../components/Loading";
import logo from "../assets/logo.png";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StoriesBar from "../components/StoriesBar";
import RecentMessages from "../components/RecentMessage";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return loading ? (
    <Loading />
  ) : (
    <div
      className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex flex-col items-center
      bg-gradient-to-b from-[#0b0f3b]via-[#1a1f4d] to-[#3c1f7f] text-white relative"
    >
      {/* Top Bar */}
      <div className="w-[90%] flex justify-between items-center p-4 absolute top-1 right-4 z-50 rounded-3xl">
        <img
          src={logo}
          alt="Logo"
          className="h-8 mr-2 hidden sm:block animate-pulse"
        />
        <div className="flex-1 flex justify-center mx-2 sm:mx-4">
          <input
            type="text"
            placeholder="ابحث هنا ..."
            className="w-full max-w-xs px-4 py-2 border rounded-3xl border-purple-500/30 bg-white/5 
            text-white placeholder-purple-300 focus:outline-none focus:ring-2 
            focus:ring-purple-500/40 transition-all text-sm"
          />
        </div>
        <div
          onClick={() => navigate("/notifications")}
          className="relative cursor-pointer p-3 rounded-full bg-gradient-to-br 
          from-purple-600 to-pink-500 shadow-[0_0_20px_rgba(255,0,255,0.5)] hover:scale-110 
          transition-transform"
        >
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
      </div>

      <div className="flex items-start justify-center xl:gap-8 w-full mt-20">
        <div className="w-full max-w-2xl px-4 sm:px-0">
          <StoriesBar />

          <div className="mt-6 space-y-6">
            {/* PostCard */}
            {feeds.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-[0_0_20px_rgba(255,0,255,0.2)] hover:shadow-[0_0_25px_rgba(255,0,255,0.4)] transition-transform duration-300"
              />
            ))}
          </div>
        </div>

        {/* الرسائل الجانبية */}
        <div className="max-xl:hidden sticky top-20">
          <RecentMessages />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-indigo-400/10 mix-blend-overlay animate-pulse-slow"></div>
    </div>
  );
};

export default Feed;
