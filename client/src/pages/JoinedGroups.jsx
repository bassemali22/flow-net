import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex justify-center text-gray-900 min-h-screen p-4 pt-16">
      <div className="w-full max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          مجموعاتي
        </h2>
        {groups.length === 0 && (
          <p className="text-gray-400 text-center">
            لم تنضم بعد لأي مجموعة أو لم يتم قبول طلبك.
          </p>
        )}
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => goToGroupChat(group._id)}
              className="p-4 bg-gray-800 text-white rounded-xl cursor-pointer hover:bg-gray-700 transition"
            >
              {group.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinedGroups;
