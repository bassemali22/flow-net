import { useNavigate } from "react-router-dom";
import { Eye, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Messages = () => {
  console.log("bassem");
  const navigate = useNavigate();
  const connection = []; // قم بربط الـ state أو البيانات الخاصة بالاتصالات هنا

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#0f172a] via-purple-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-6">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Messages
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            Connect with your friends in a cosmic style
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          {connection.map((user, index) => (
            <motion.div
              key={user._id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center justify-between gap-4 p-5 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-purple-500/40 hover:border-purple-400 transition cursor-pointer"
              onClick={() => navigate(`/messages/${user._id}`)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="rounded-full size-14 border-2 border-purple-500 shadow-md shadow-purple-500/40 object-cover"
                />
                <div>
                  <p className="font-semibold text-white text-lg">
                    {user.full_name}
                  </p>
                  <p className="text-sm text-purple-300">@{user.username}</p>
                  <p className="text-sm text-gray-300 truncate max-w-[220px]">
                    {user.bio || "No bio available"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/messages/${user._id}`);
                  }}
                  className="p-3 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 text-white shadow-md shadow-purple-500/30 transition"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${user._id}`);
                  }}
                  className="p-3 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 text-white shadow-md shadow-purple-500/30 transition"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
