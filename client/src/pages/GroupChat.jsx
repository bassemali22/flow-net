import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const GroupChat = () => {
  const { user } = useUser();

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/group/owned/${user.id}`,
        );

        console.log("GROUPS RESPONSE:", res.data);

        setGroups(res.data.groups || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
  }, [user]);

  const createGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/group`,
        {
          name: groupName,
        },
      );

      console.log("CREATED GROUP:", res.data);

      setGroups((prev) => [...prev, res.data]);

      setGroupName("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center bg-gray-900 min-h-screen p-4">
      <div className="w-full max-w-3xl space-y-4">
        <header className="text-2xl font-bold text-white text-center bg-gradient-to-r from-purple-800 to-indigo-800 p-4 rounded-xl shadow-md">
          إنشاء مجموعاتك
        </header>

        <div className="space-y-3">
          {groups.length === 0 ? (
            <p className="text-gray-300 text-center">لا توجد مجموعات لديك</p>
          ) : (
            groups.map((g) => (
              <div
                key={g._id}
                className="p-3 bg-gray-800 rounded-xl text-white text-center font-medium"
              >
                {g.name}
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="اسم المجموعة"
            className="flex-1 p-2 bg-gray-800 border border-gray-700 text-white rounded-xl"
          />

          <button
            onClick={createGroup}
            className="px-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 hover:opacity-80 text-white"
          >
            إنشاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
