import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import sample_cover from "../assets/sample_cover.jpg";
import sample_profile from "../assets/sample_profile.jpg";
import ProfileModal from "../components/ProfileModal";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
// تأكد من استيراد دالة التحديث من الـ slice لديك إذا كنت تستخدمها:
// import { updateUser } from "../redux/userSlice";

const Profile = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.value);
  const following = useSelector((state) => state.connections.following);
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    location: "",
    full_name: "",
    profile_picture: null,
    cover_photo: null,
  });

  const isMyProfile = !profileId || profileId === currentUser?._id;

  const fetchUser = async (id) => {
    try {
      console.log("🚀 fetchUser CALLED");
      console.log("ID:", id);

      const token = await getToken();

      const { data } = await api.post(
        "/api/user/profiles",
        { profileId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("✅ RESPONSE:", data);

      if (data.success) {
        const followed = following.some((u) => u._id === data.profile._id);

        setUser({
          ...data.profile,
          isFollowed: followed,
        });

        setIsBlocked(data.isBlocked);

        if (!data.isBlocked) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } else {
        toast.error(data.message || "Failed to load profile");
      }
    } catch (error) {
      console.log("❌ ERROR:", error.response?.data || error.message);
      toast.error(error.message);
    }
  };

  const toggleBlock = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      if (isBlocked) {
        const { data } = await api.post(
          "/api/user/unblock",
          { userIdToUnblock: user._id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (data.success) {
          setIsBlocked(false);
          fetchUser(user._id);
          toast.success("User unblocked successfully");
        }
      } else {
        const { data } = await api.post(
          "/api/user/block",
          { userIdToBlock: user._id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (data.success) {
          setIsBlocked(true);
          setPosts([]);
          toast.success("User blocked successfully");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const userData = new FormData();
      userData.append("username", editForm.username);
      userData.append("location", editForm.location);
      userData.append("bio", editForm.bio);
      userData.append("full_name", editForm.full_name);
      if (editForm.profile_picture instanceof File) {
        userData.append("profile", editForm.profile_picture);
      }
      if (editForm.cover_photo instanceof File) {
        userData.append("cover", editForm.cover_photo);
      }

      const token = await getToken();

      // تأكد من تفعيل دالة updateUser واستيرادها إذا كنت تستخدم Redux Thunk
      // const result = await dispatch(updateUser({ userData, token }));

      // أو إرسال الطلب مباشرة عبر api إذا لم تكن تستخدم Thunk:
      const { data } = await api.put("/api/user/update", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Profile updated successfully!");
        setShowEdit(false);
        if (profileId) fetchUser(profileId);
        else if (currentUser?._id) fetchUser(currentUser?._id);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const endpoint = user.isFollowed
        ? "/api/user/unfollow"
        : "/api/user/follow";
      const payload = { id: user._id };
      const { data } = await api.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        setUser((prev) => ({
          ...prev,
          isFollowed: !prev.isFollowed,
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    console.log("🔥 USE EFFECT STARTED");
    console.log("profileId:", profileId);
    console.log("currentUser:", currentUser);

    if (profileId) {
      console.log("➡️ fetching profileId");
      fetchUser(profileId);
    } else if (currentUser?._id) {
      console.log("➡️ fetching current user");
      fetchUser(currentUser._id);
    } else {
      console.log("❌ No profileId and no currentUser");
    }
  }, [profileId, currentUser?._id, following]);

  if (!currentUser || !user) return <Loading />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-y-scroll p-6">
      <div className="max-w-5xl mx-auto">
        {/* Cover & Avatar */}
        <div className="relative">
          <div className="h-56 rounded-3xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-xl shadow-2xl overflow-hidden">
            {user?.cover_photo && (
              <img
                src={user.cover_photo}
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
                alt="Cover"
              />
            )}
          </div>
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <img
              src={user?.profile_picture || sample_profile}
              className="w-32 h-32 rounded-full border-4 border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.8)] object-cover"
              alt="Profile"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-20 text-center text-white">
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {user?.bio || "No bio yet..."}
          </p>

          {isMyProfile ? (
            <button
              onClick={() => setShowEdit(true)}
              className="mt-3 px-4 py-2 bg-purple-600/30 rounded-xl border cursor-pointer border-purple-500/50 hover:bg-purple-600/50 text-sm text-white"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-xl text-sm font-medium shadow-lg transition-all ${
                  user?.isFollowed
                    ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                    : "bg-gradient-to-r from-gray-400 to-teal-500 hover:from-gray-500 hover:to-teal-600 text-white"
                }`}
              >
                {user?.isFollowed ? "Unfollow" : "Follow"}
              </button>

              <button
                onClick={toggleBlock}
                className={`px-6 py-2 rounded-xl text-sm font-medium shadow-lg transition-all ${
                  isBlocked
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-purple-600/30 hover:bg-purple-600/50 text-white"
                }`}
              >
                {isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-10 flex justify-center gap-6">
          {["posts", "media"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-purple-600 text-white scale-110 shadow-lg shadow-purple-500/50"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Posts & Media Sections */}
        <div className="mt-8 flex flex-col items-center gap-6">
          {activeTab === "posts" &&
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={{
                  ...post,
                  user: {
                    _id: user?._id,
                    username: user?.username,
                    profile_picture: user?.profile_picture,
                    full_name: user?.full_name,
                  },
                }}
                className="w-full max-w-2xl"
              />
            ))}

          {activeTab === "media" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {posts
                .filter((p) => p.image_urls && p.image_urls.length > 0)
                .map((p) =>
                  p.image_urls.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="rounded-xl object-cover shadow-lg hover:scale-105 transition-all w-full h-48"
                      alt="Media post"
                    />
                  )),
                )}
            </div>
          )}
        </div>

        {showEdit && (
          <ProfileModal
            setShowEdit={setShowEdit}
            editForm={editForm}
            setEditForm={setEditForm}
            handleSaveProfile={handleSaveProfile}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
