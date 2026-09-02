import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Rocket,
  Globe,
  Sparkles,
  Star,
  Shield,
  Sword,
} from "lucide-react";

const icons = [Users, Rocket, Globe, Sparkles, Star, Shield, Sword];

const AvailableGroups = () => {
  const { user } = useUser();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/group/available`,
        );
        const data = res.data;
        setGroups(Array.isArray(data) ? data : data.groups || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  const requestJoin = async (groupId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/group/join/${groupId}`,
        { userId: user?.id },
      );
      alert("تم إرسال طلب الانضمام بنجاح");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "حدث خطأ أثناء إرسال الطلب");
    }
  };

  return (
    <div className="flex justify-center bg-gray-900 min-h-screen p-6 pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25)_0%,transparent_50%)]"></div>
      <div className="w-full max-w-6xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 text-transparent bg-clip-text"
        >
          المجموعات المتاحة
        </motion.h2>

        {groups.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 text-center"
          >
            لا توجد مجموعات متاحة للانضمام
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
                className="relative group bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 shadow-lg hover:shadow-2xl overflow-hidden border border-purple-600/20"
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-700 bg-[conic-gradient(at_top_right,purple,indigo,pink,blue,purple)] animate-spin-slow"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-4 rounded-full bg-purple-600/30 text-purple-400 shadow-lg shadow-purple-500/40">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-lg text-white truncate">
                    {g.name}
                  </span>
                </div>

                <div className="mt-6 relative z-10">
                  <button
                    onClick={() => requestJoin(g._id)}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 active:scale-95 transition font-medium"
                  >
                    طلب انضمام
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

export default AvailableGroups;
