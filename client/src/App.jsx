import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Feed from "./pages/Feed";
import Message from "./pages/Message";
import Chat from "./pages/Chat";
import Connection from "./pages/Connection";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import NotificationsPage from "./pages/NotificationsPage";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import PostDetails from "./pages/PostDetails";
import { fetchConnections } from "./features/connections/connectionsSlice";
import { addMessages } from "./features/messages/messagesSlice";
import GroupChat from "./pages/GroupChat";
import AvailableGroups from "./pages/AvailableGroups";
import GropRequestsManager from "./pages/GropRequestsManager";
import JoinedGroups from "./pages/JoinedGroups";
import JoinedGroupsChat from "./pages/JoinedGroupsChat";
const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    };
    fetchData();
  }, [user, getToken, dispatch]);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location]);

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(
        import.meta.env.VITE_BASEURL + "/api/message/" + user.id,
      );

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (pathnameRef.current === "/messages/" + message.from_user_id) {
          dispatch(addMessages(message));
        } else {
          // إشعارات أو معالجة أخرى
        }
      };

      return () => {
        eventSource.close();
      };
    }
  }, [user, dispatch]);
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Message />} />
          <Route path="message/:userid" element={<Chat />} />
          <Route path="connections" element={<Connection />} />
          <Route path="search" element={<Search />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileid" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="settings" element={<Settings />} />
          <Route path="post-details/:postId" element={<PostDetails />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="groups" element={<GroupChat />} />
          <Route path="groups/available" element={<AvailableGroups />} />
          <Route
            path="groups/requests"
            element={
              user ? <GropRequestsManager ownerId={user.id} /> : <Login />
            }
          />
          <Route path="groups/joined" element={<JoinedGroups />} />
          <Route path="groups/chat/:groupId" element={<JoinedGroupsChat />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
