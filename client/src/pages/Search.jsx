import { Search as SearchIcon } from "lucide-react";
import Loading from "../components/Loading";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState } from "react";

const SearchPage = () => {
  const [input, setInput] = useState("");
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    // منطق البحث الخاص بك هنا
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f3b] via-[#1a1f4d] to-[#3c1f7f] text-white">
      {/* تم تعديل الحواشي لتتطابق بسلاسة مع الهواتف والشاشات الكبيرة */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* رأس الصفحة مع ضبط حجم الخط للأجهزة الصغيرة */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Discover People
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mt-2 px-2">
            Connect with amazing people and grow your magical network
          </p>
        </motion.div>

        {/* صندوق البحث بحشو وحواف متجاوبة */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8 shadow-lg rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg"
        >
          <div className="p-4 sm:p-6">
            <div className="relative">
              <SearchIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, username, bio, or location..."
                className="pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 w-full text-sm sm:text-base border border-purple-600 rounded-xl bg-slate-900/70 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </motion.div>

        {/* شبكة عرض المستخدمين متجاوبة بالكامل (عمود للشاشات الصغيرة، عمودين للتابلت، 3 للشاشات الكبيرة) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {Users.length === 0 && !loading && (
            <p className="text-gray-400 col-span-full text-center mt-12 text-sm sm:text-base">
              No users found. Try searching something else...
            </p>
          )}

          {Users.map((user) => (
            <motion.div
              key={user._id}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 20px rgba(255,0,255,0.6)",
              }}
              className="relative p-5 sm:p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-pink-500 shadow-none transition-all duration-300"
            >
              {/* User Card */}
            </motion.div>
          ))}
        </motion.div>

        {loading && <Loading height="50vh" />}
      </div>
    </div>
  );
};

export default SearchPage;
