import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import sample_cover from "../assets/sample_cover.jpg";
import sample_profile from "../assets/sample_profile.jpg";
import ProfileModal from "../components/ProfileModal";

const Profile = () => {
  const currentUser = {
    _id: "123",
    username: "MyUser",
    profile_picture: "/default-profile.png",
  };
  const { profileId } = useParams();
  const [user, setUser] = useState({
    _id: "1",
    username: "John Doe",
    full_name: "John Doe",
    profile_picture: sample_profile,
    cover_photo: sample_cover,
    bio: "This is a bio",
    isFollowed: false,
    location: "syria",
  });
  const [posts, setPosts] = useState([
    {
      _id: "post1",
      content: "Hello World!",
      image_urls: ["/sample1.jpg", "/sample2.jpg"],
    },
  ]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: sample_profile,
    cover_photo: sample_cover,
    full_name: user.full_name,
  });

  const isMyProfile = !profileId || profileId === currentUser?._id;

  const handleFollowToggle = () => {};
  const toggleBlock = () => {};
  const handleSaveProfile = async () => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-y-scroll p-6">
      <div className="max-w-5xl mx-auto">
        {/* Cover & Avatar */}
        <div className="relative">
          <div className="h-56 rounded-3xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-xl shadow-2xl overflow-hidden">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
                alt="Cover"
              />
            )}
          </div>
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <img
              src={user.profile_picture}
              className="w-32 h-32 rounded-full border-4 border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.8)] object-cover"
              alt="Profile"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-20 text-center text-white">
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {user.bio || "No bio yet..."}
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
                  user.isFollowed
                    ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                    : "bg-gradient-to-r from-gray-400 to-teal-500 hover:from-gray-500 hover:to-teal-600 text-white"
                }`}
              >
                {user.isFollowed ? "Unfollow" : "Follow"}
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
                    _id: user._id,
                    username: user.username,
                    profile_picture: user.profile_picture,
                    full_name: user.full_name,
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
            editForm={editForm}
            setEditForm={setEditForm}
            user={user}
            handleSaveProfile={handleSaveProfile}
            setShowEdit={setShowEdit}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
