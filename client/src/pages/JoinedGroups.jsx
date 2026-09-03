import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Rocket,
  Sparkles,
  Star,
  Shield,
  Sword,
} from "lucide-react";
const icons = [Users, Globe, Rocket, Sparkles, Star, Shield, Sword];
const JoinedGroups = () => {
  const { user } = useUser();
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchJoinedGroups = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/group/joined/${user.id}`,
        );
        setGroups(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJoinedGroups();
  }, [user]);

  const goToGroupChat = (groupId) => {
    navigate(`/groups/chat/${groupId}`);
  };

  return (
    <div className="flex justify-center bg-gray-950 min-h-screen p-6 pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent)] animate-pulse"></div>

      <div className="w-full max-w-6xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 text-transparent bg-clip-text"
        >
          مجموعاتي
        </motion.h2>

        {groups.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-center"
          >
            لم تنضم بعد لأي مجموعة أو لم يتم قبول طلبك
          </motion.p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((g, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={g._id}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="relative group bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-2xl p-6 shadow-lg hover:shadow-2xl overflow-hidden border border-indigo-600/20"
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-700 bg-[conic-gradient(at_top_right,indigo,blue,purple,pink,indigo)] animate-spin-slow"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-4 rounded-full bg-indigo-600/30 text-indigo-400 shadow-lg shadow-indigo-500/40">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-lg text-white truncate">
                    {g.name}
                  </span>
                </div>

                {/* زر الدخول */}
                <div className="mt-6 relative z-10">
                  <button
                    onClick={() => goToGroupChat(g._id)}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition font-medium"
                  >
                    دخول المجموعة
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JoinedGroups;
