import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Home/Navbar/Navbar";
import Left from "./../components/Home/Left/Left";
import Main from "./../components/Home/Main/Main";
import Right from "./../components/Home/Right/Right";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/Context";
import {
  newsFeedAPI,
  deletePostAPI,
  createCommentAPI,
  deleteCommentAPI,
  commentEditAPI,
  likePostAPI,
  unlikePostAPI,
  sharePostAPI,
  createPost,
} from "../services/PostAPI";
import {
  addFollower,
  removeFollower,
  findPeople,
  userFollow,
  userUnfollow,
  userFollowing,
  userFollowers,
  currentUser,
} from "../services/AuthApis";
import { toast } from "react-toastify";

const Home = () => {
  //context
  const [state, setState] = useContext(UserContext);
  // posts
  const [posts, setPosts] = useState([]);

  // users
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    if (state && state.token) {
      handleNewsFeedAPI();
      handleUpdateStateUser();
    }
  }, [state && state.token]);

  /* Auth APIs  */

  const navigate = useNavigate();

  const handleUpdateStateUser = async () => {
    try {
      const { data } = await currentUser();
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data.user;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update Context
      setState({ ...state, user: data.user });
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };

  /* find people */

  const handleFindPeople = async () => {
    try {
      const res = await findPeople();
      setSuggested(res.data);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddFollowers = async (id) => {
    const res = await addFollower(id);
    handleUpdateStateUser();
    handleUserFollowers();
    handleUserFollowing();
    return res;
  };

  const handleUserFollow = async (id) => {
    const { data } = await userFollow(id);
    toast.success(data.message);
    handleNewsFeedAPI();
    handleFindPeople();
    handleUserFollowers();
    handleUserFollowing();
    let auth = JSON.parse(localStorage.getItem("auth"));
    auth.user = data;
    localStorage.setItem("auth", JSON.stringify(auth));
    // update context
    setState({ ...state, user: data });
    return data;
  };

  const handleRemoveFollower = async (id) => {
    const res = await removeFollower(id);
    handleUpdateStateUser();
    handleUserFollowers();
    handleUserFollowing();
    handleFindPeople();
    return res;
  };

  const handleUserUnfollow = async (id) => {
    const res = await userUnfollow(id);
    handleUserFollowing();
    handleUpdateStateUser();
    handleUserFollowers();
    handleFindPeople();
    return res;
  };

  const handleUserFollowers = async (id) => {
    const res = await userFollowers(id);
    handleUpdateStateUser();
    handleNewsFeedAPI();
    setFollowers(res.data);
    return res;
  };

  const handleUserFollowing = async (id) => {
    const res = await userFollowing(id);
    handleUpdateStateUser();
    setFollowing(res.data);
    handleNewsFeedAPI();
    return res;
  };

  /* Post APIs */

  const handleCreatePost = async (data) => {
    const res = await createPost(data);
    handleNewsFeedAPI();
    handleUpdateStateUser();
  };

  const handleDeletePostAPI = async (id, fileType) => {
    const file = { fileType };
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await deletePostAPI(id, file);
      toast.success(data.message);
      handleUpdateStateUser();
      handleNewsFeedAPI();
    } catch (err) {
      console.log(err);
    }
  };

  /* all post fetch */
  const handleNewsFeedAPI = async () => {
    try {
      handleUpdateStateUser();
      const { data } = await newsFeedAPI(state.user._id);
      setPosts(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateCommentAPI = async (id, comment) => {
    if (!comment) {
      toast.error("write comment");
      return;
    }
    const data = { comment, id, postedById: state.user._id };
    try {
      const res = await createCommentAPI(data);
      handleNewsFeedAPI();
      // toast.success(res.data.message);
      return res;
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteCommentAPI = async (id, commentId) => {
    let answer = window.confirm("Are you sure?");
    if (!answer) return;
    const data = { id, commentId };
    try {
      if (!id || !commentId) {
        console.log("id required");
        return;
      }
      const res = await deleteCommentAPI(data);

      handleNewsFeedAPI();
      // toast.success(res.data.message);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentEditAPI = async (id, newComment, commentId) => {
    const data = { id, newComment, commentId };
    try {
      if (!id || !newComment || !commentId) {
        console.log("error");
        return;
      }

      const res = await commentEditAPI(data);
      handleNewsFeedAPI();
      //toast.success(res.data.message);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const handleLikePostAPI = async (id) => {
    try {
      const res = await likePostAPI(id);
      handleUpdateStateUser();
      handleNewsFeedAPI();
      return res;
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnlikePostAPI = async (id) => {
    try {
      const res = await unlikePostAPI(id);

      handleNewsFeedAPI();
      handleUpdateStateUser();
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSharePostAPI = async (id) => {
    try {
      const res = await sharePostAPI(id);
      toast.success(res.data.message);
      handleNewsFeedAPI();
      handleUpdateStateUser();
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="container-fluid m-0 p-0 Home-Container"
      style={{ backgroundColor: "#002853" }}
    >
      <Navbar />

      <div className="container-display">
        <Left />
        <Main
          posts={posts}
          handleUserFollowing={handleUserFollowing}
          handleCreatePost={handleCreatePost}
          handleDeletePostAPI={handleDeletePostAPI}
          handleCreateCommentAPI={handleCreateCommentAPI}
          handleDeleteCommentAPI={handleDeleteCommentAPI}
          handleCommentEditAPI={handleCommentEditAPI}
          handleLikePostAPI={handleLikePostAPI}
          handleUnlikePostAPI={handleUnlikePostAPI}
          handleSharePostAPI={handleSharePostAPI}
        />
        <Right
          handleFindPeople={handleFindPeople}
          handleUserFollowers={handleUserFollowers}
          handleUserFollowing={handleUserFollowing}
          handleAddFollowers={handleAddFollowers}
          handleRemoveFollower={handleRemoveFollower}
          handleUserFollow={handleUserFollow}
          handleUserUnfollow={handleUserUnfollow}
          followers={followers}
          following={following}
          suggested={suggested}
        />
      </div>
    </div>
  );
};

export default Home;
