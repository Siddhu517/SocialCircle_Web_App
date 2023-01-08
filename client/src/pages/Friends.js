import React, { useState, useEffect } from "react";
import Navbar from "./../components/Home/Navbar/Navbar";
import "./friends.css";
import FLeft from "../components/Friends/left/FLeft";
import FRight from "../components/Home/FRight/FRight";
import { friendDetails } from "../services/AuthApis";
import { friendPosts } from "../services/PostAPI";
import Posts from "../components/Friends/FriendPostsSection/Posts";

const Friends = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [username, setUserName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const pathname = window.location.pathname;
      setUserName(String(pathname.slice(8)));
      const res = await friendDetails(String(pathname.slice(8)));
      setUser(res.data);
      setUserName(String(pathname.slice(8)));
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const pathname = window.location.pathname;
      const resPost = await friendPosts(String(pathname.slice(8)));
      console.log("post => ", resPost.data);
      setPosts(resPost.data);
      const res = await friendDetails(String(pathname.slice(8)));
      setUser(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="friends-container">
      <Navbar display="hidden" />
      <div className="friendSection">
        <FLeft user={user} />
        <Posts posts={posts} />
        <FRight username={username} user={user} />
      </div>
    </div>
  );
};

export default Friends;
