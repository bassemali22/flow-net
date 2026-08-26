import { Image as ImageIcon, SendHorizonal, X } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const currentUser = {
  _id: "1",
  username: "myuser",
  full_name: "My Name",
  profile_picture: "https://i.pravatar.cc/40?img=1",
};

const user = {
  _id: "2",
  username: "friend",
  full_name: "Friend Name",
  profile_picture: "https://i.pravatar.cc/40?img=2",
};

const connections = [user];

const initialMessages = [
  {
    id: "m1",
    from_user_id: "2",
    text: "مرحباً!",
    message_type: "text",
    createdAt: "2025-09-13T10:00:00Z",
  },
];

const Chat = () => {
  const { userid } = useParams();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // أضفنا حالة الصورة المفقودة
  const [localMessages, setLocalMessages] = useState(initialMessages);
  const [isBlockedByUser, setIsBlockedByUser] = useState(false);
  
  const messageEndRef = useRef(null);
  console.log(userid);

  // التمرير التلقائي لأسفل عند تغيير الرسائل
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const sendMessage = () => {
    if (!text.trim() && !image) return;
    
    setLocalMessages([
      ...localMessages,
      {
        id: Date.now().toString(),
        from_user_id: currentUser._id,
        text,
        message_type: image ? "image" : "text",
        media_url: image ? URL.createObjectURL(image) : null,
        createdAt: new Date().toISOString(),
      },
    ]);
    
    setText("");
    setImage(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0b0f3b] via-[#1a1f4d] to-[#3c1f7f] text-white overflow-hidden relative">
      {/* Header */}
      <div className="flex ml-16 items-center gap-3 p-3 md:px-10 bg-white/5 backdrop-blur-lg border-b border-purple-500/30 shadow-[0_0_15px_rgba(131,58,180,0.3)] z-10">
        <img
          src={user.profile_picture || ""}
          className="w-12 h-12 rounded-full border border-purple-300 shadow-[0_0_10px_rgba(255,255,255,0.5)] object-cover"
        />
        <div>
          <p className="font-bold text-purple-200">{user.full_name}</p>
          <p className="text-sm text-gray-400">@{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 md:px-10 overflow-y-scroll relative">
        {isBlockedByUser ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="bg-gradient-to-br from-purple-600/50 via-pink-600/40 to-indigo-500/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-purple-400/50"
            >
              <p className="text-2xl font-bold text-white mb-4">
                لقد قام هذا المستخدم بحظرك
              </p>
              <p className="text-purple-200 text-lg">
                للأسف لا يمكنك مراسلته، ربما في المستقبل سيكون هناك فرصة للتواصل ✨
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4 max-w-full mx-auto pb-20">
            {localMessages
              .toSorted(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
              )
              .map((message, index) => {
                const isCurrentUserId =
                  message.from_user_id === currentUser._id;
                const sender = isCurrentUserId
                  ? null
                  : connections.find((c) => c._id === message.from_user_id);
                return (
                  <motion.div
                    key={message.id + "" + index}
                    initial={{ opacity: 0, x: isCurrentUserId ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                    }}
                    className={`flex items-start gap-2 ${isCurrentUserId ? "justify-end" : "justify-start ml-16 md:ml-24"}`}
                  >
                    {!isCurrentUserId && sender && (
                      <div className="flex flex-col items-center">
                        <img
                          src={sender.profile_picture || ""}
                          className="w-8 h-8 rounded-full border border-purple-500 shadow-[0_0_10px_rgba(255,0,255,0.5)] object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`p-3 text-sm max-w-sm rounded-xl shadow-lg ${
                        isCurrentUserId
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none"
                          : "bg-white/10 backdrop-blur-lg rounded-br-none border border-purple-500/30"
                      } transition-all duration-300`}
                    >
                      {message.message_type === "image" && message.media_url && (
                        <img
                          src={message.media_url}
                          className="w-full max-w-sm rounded-xl mb-1 shadow-[0_0_10px_rgba(255,0,255,0.5)] object-cover"
                        />
                      )}
                      {message.text && <p>{message.text}</p>}
                    </div>
                    {isCurrentUserId && (
                      <div className="flex flex-col items-center">
                        <img
                          src={currentUser?.profile_picture || ""}
                          className="w-8 h-8 rounded-full border border-indigo-400 shadow-[0_0_10px_rgba(255,0,255,0.5)] object-cover"
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Input Box */}
      {!isBlockedByUser && (
        <div className="px-4 pb-4">
          {image && (
            <div className="max-w-xl mx-auto mb-2 relative inline-block">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="h-16 rounded-xl border border-purple-400 shadow-[0_0_10px_rgba(255,0,255,0.5)] object-cover"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1 text-white hover:bg-black transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 px-5 py-2 bg-white/15 backdrop-blur-lg border border-purple-500/30 shadow-[0_0_15px_rgba(131,58,180,0.4)] rounded-full max-w-xl mx-auto">
            <input
              type="text"
              className="flex-1 outline-none text-white bg-transparent placeholder-gray-300 text-sm"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <label
              htmlFor="image"
              className="cursor-pointer text-purple-300 hover:text-white transition"
            >
              <ImageIcon className="w-6 h-6" />
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 p-2 rounded-full text-white transition shadow-md"
            >
              <SendHorizonal className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;