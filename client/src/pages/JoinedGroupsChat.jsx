import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASEURL || "http://localhost:4000");

const JoinedGroupsChat = () => {
  const { user } = useUser();
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!groupId) return;
    const init = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/group/${groupId}`,
        );
        const groupData = res.data.group || res.data;
        if (!groupData) {
          alert();
          navigate("/groups");
          return;
        }
        const isMember = group.members.some(
          (m) => m.userId === user.id && m.status === "accepted",
        );
        if (!isMember) {
          alert("ليس لديك صلاحية الدخول لهذه المجموعة");
          navigate("/groups");
          return;
        }
        socket.emit("join_group", { groupId, userId: user.id });

        const messagesRes = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/group/${groupId}/messages`,
        );
        const msgs = Array.isArray(messagesRes.data)
          ? messagesRes.data
          : messagesRes.data?.messages || [];
        setMessages(msgs);

        socket.on("receive_message", (msg) => {
          if (msg.groupId === groupId) setMessages((prev) => [...prev, msg]);
        });
      } catch (err) {
        console.error(err);
        navigate("/groups");
      }
    };
    init();
    return () => {
      socket.off("receive_message");
      socket.emit("leave_group", { groupId, userId: user?.id });
    };
  }, [groupId, user, navigate]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMessage = { groupId, sender: user.id, text: message };
    socket.emit("send_message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="p-4 text-center text-2xl font-bold text-white bg-gradient-to-r from-purple-800 to-indigo-900 shadow">
        غرفة الدردشة
      </header>

      <div className="flex-1 flex justify-center items-start p-4 overflow-y-auto bg-gray-900">
        <div className="w-full max-w-6xl flex flex-col flex-1 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-xs ${
                m.sender === user.id
                  ? "ml-auto bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
                  : "mr-auto bg-gray-800 text-white"
              }`}
            >
              <p className="text-sm opacity-70">{m.sender}</p>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center p-4 bg-gray-900">
        <div className="w-full max-w-3xl flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder=""
            className="flex-1 p-2 rounded-xl bg-gray-800 border border-gray-700 text-white"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-700 rounded-xl hover:opacity-80 text-white"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinedGroupsChat;
