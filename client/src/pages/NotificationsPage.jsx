import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Image, Bell } from "lucide-react";
import moment from "moment";
import { useState, useEffect } from "react";
const TABS = [
  { key: "all", label: "All", icon: Bell },
  { key: "like", label: "Likes", icon: Heart },
  { key: "comment", label: "Comments", icon: MessageCircle },
  { key: "media", label: "Media", icon: Image },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f3b] via-[#1a1f4d] to-[#3c1f7f] text-white p-4 sm:p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 bg-[#182034]/55 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-purple-500/30 mb-8"
        >
          <Bell className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Notifications
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 justify-center mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <motion.div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer p-3 rounded-xl backdrop-blur-lg bg-[#182034]/30 border border-purple-500/20 flex items-center justify-center`}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: isActive ? 1.15 : 1 }}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-purple-400" : "text-gray-400"}`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <AnimatePresence>
              {filtered.map((n) => {
                const user = n.from_user;
                return (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative flex items-center gap-4 p-4 rounded-2xl backdrop-blur-lg bg-[#102034]/40 border border-purple-500/20 shadow-lg hover:bg-[#0d2040]/30 transition-all"
                  >
                    {/* Profile */}
                    <motion.img
                      src={user.profile_picture}
                      alt={user.full_name}
                      className="w-12 h-12 rounded-full border border-purple-400 shadow-none"
                    />
                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold">{user.full_name}</span>{" "}
                        {n.type === "like" && "liked your post"}
                        {n.type === "comment" && "commented on your post"}
                        {n.type === "media" && "shared media with you"}
                      </p>
                      {n.type === "comment" && n.commentText && (
                        <div className="mt-1.5 p-2 rounded-lg bg-[#1f264f]/60 border border-purple-500/20 text-gray-200 text-sm">
                          {n.commentText}
                        </div>
                      )}
                      <span className="text-xs text-gray-400 mt-1 block">
                        {moment(n.createdAt).fromNow()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
