import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@clerk/react";
import moment from "moment";
// import axios from "axios";
// import { BACKEND_URL } from "../App";

const RecentMessages = ({ viewStory }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();

  // const fetchRecentMessages = async () => {
  //   try {
  //     const response = await axios.get(`${BACKEND_URL}/api/messages/recent`, {
  //       headers: { userId: user?.id },
  //     });
  //     if (response.data.success) {
  //       setMessages(response.data.messages);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (user) {
  //     fetchRecentMessages();
  //   }
  // }, [user]);

  return (
    <motion.div
      className={`w-72 flex flex-col text-sm absolute top-0 -right-96 ${
        viewStory ? "hidden" : "flex"
      } bg-gradient-to-b from-[#1a1f4d]/80 via-[#0f172a]/60 to-[#0b0f3b]/90 backdrop-blur-xl rounded-3xl shadow-[0_0_25px_rgba(131,58,180,0.5)] border border-purple-500/30 overflow-hidden`}
    >
      <h3 className="font-bold text-white px-4 py-3 border-b border-purple-500/30 bg-purple-900/10 backdrop-blur-md">
        Messages
      </h3>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent max-h-[400px]">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Link
              key={index}
              to={`/messages/${message.from_user_id?._id}`}
              className="flex items-center gap-3 p-3 hover:bg-purple-900/20 border-b border-purple-500/10 transition"
            >
              <img
                src={
                  message.from_user_id?.profile_picture || "/default-avatar.png"
                }
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">
                  {message.from_user_id?.full_name}
                </p>
                <p className="text-purple-300 text-xs truncate">
                  {message.text ? message.text : "Media file"}
                </p>
              </div>

              <div className="flex flex-col items-end text-xs text-purple-400">
                <span>{moment(message.createdAt).fromNow(true)}</span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-purple-300 text-xs py-4">
            No recent messages
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default RecentMessages;
