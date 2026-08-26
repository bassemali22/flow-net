import React from "react";
import { Routes, Route } from "react-router-dom";
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
import { useUser } from "@clerk/react";
import { Toaster } from "react-hot-toast";
const App = () => {
  const { user } = useUser();
  return (
    <>
      <Toaster />
      <Routes>
        <Route element element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Message />} />
          <Route path="message/:userid" element={<Chat />} />
          <Route path="connections" element={<Connection />} />
          <Route path="search" element={<Search />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileid" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
