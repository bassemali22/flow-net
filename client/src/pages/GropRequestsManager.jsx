import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const GropRequestsManager = ({ ownerId }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchOwnedGroups = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/groups/owned/${ownerId}`,
        );
        setGroups(res.data.groups || []);
      } catch (err) {
        console.error("error ", err);
        setGroups({});
      }
    };

    i;
    fetchOwnedGroups();
  }, [ownerId]);

  const acceptRequest = async (groupId, userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/group/${groupId}/accept`,
        { userId },
      );
      alert("تم قبول العضو!");
      setGroups((prev) =>
        prev.map((g) =>
          g._id === groupId
            ? {
                ...g,
                members: g.members.map((m) =>
                  m.userId === userId ? { ...m, status: "accepted" } : m,
                ),
              }
            : g,
        ),
      );
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-955 text-white">
      <h2 className="text-2xl font-bold mb-4">طلبات الانضمام لمجموعاتي</h2>
      {groups.length === 0 ? (
        <p>لا توجد مجموعات ملكك</p>
      ) : (
        groups.map((g) => (
          <div
            key={g._id}
            className="mb-6 bg-gray-900 p-4 rounded-xl shadow-md"
          >
            <h3 className="font-bold mb-2">{g.name}</h3>
            <RequestsList group={g} acceptRequest={acceptRequest} />
          </div>
        ))
      )}
    </div>
  );
};

function RequestsList({ group, acceptRequest }) {
  const pendingMembers = group.members.filter((m) => m.status === "pending");

  if (pendingMembers.length === 0) {
    return <p className="text-gray-400">لا توجد طلبات معلقة</p>;
  }

  return (
    <ul>
      {pendingMembers.map((req) => (
        <li
          key={req.userId}
          className="flex justify-between items-center py-2 border-b border-gray-800"
        >
          <span>{req.userId}</span>
          <button
            onClick={() => acceptRequest(group._id, req.userId)}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded"
          >
            قبول
          </button>
        </li>
      ))}
    </ul>
  );
}

export default GropRequestsManager;
