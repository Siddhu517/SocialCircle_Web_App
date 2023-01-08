import React, { useState} from "react";
import "./right.css";
import Followers from "./../FRight/UsersList/FFollowers";
import Following from "./../FRight/UsersList/FFollowing";
import Suggested from "./../FRight/UsersList/FSuggested";
import {
  friendFollowers,
  friendFollowing,
  findPeopleFriend,
} from "../../../services/AuthApis";

const FRight = ({ handleNavigateUser, username, user }) => {
  const [viewList, setViewList] = useState("suggested");

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggested, setSuggested] = useState([]);

  const handleFollowers = async () => {
    const res = await friendFollowers(username);
    console.log(res.data);
    setFollowers(res.data);
  };
  const handleFollowing = async () => {
    const res = await friendFollowing(username);
    console.log(res.data);
    setFollowing(res.data);
  };
  const handleSuggested = async () => {
    const res = await findPeopleFriend(username);
    console.log(res.data);
    setSuggested(res.data);
  };

  const handleFollowTab = async () => {
    try {
      setViewList("follow");
      await handleFollowers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollowingTab = async () => {
    try {
      setViewList("following");
      await handleFollowing();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSuggestedTab = async () => {
    try {
      setViewList("suggested");
      await handleSuggested();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="right-friend-section">
      <div className="section-display ">
        <div className="adSectionFright ">
          <img
            className="img-fluid"
            src={user && user.back_image ? user.back_image.url : ""}
          />
        </div>
        <div className="UserFriends "> 
          <div className="MenuBar">
            <span className="sec1" onClick={handleFollowTab}>
              Follow
            </span>
            <span className="sec2" onClick={handleFollowingTab}>
              Following
            </span>
            <span className="sec3" onClick={handleSuggestedTab}>
              Suggested
            </span>
          </div>

          {viewList && viewList === "follow" ? (
            <Followers
              handleNavigateUser={handleNavigateUser}
              followers={followers}
              display="hidden"
            />
          ) : viewList === "following" ? (
            <Following
              handleNavigateUser={handleNavigateUser}
              following={following}
              display="hidden"
            />
          ) : viewList === "suggested" ? (
            <Suggested
              handleNavigateUser={handleNavigateUser}
              suggested={suggested}
              display="hidden"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default FRight;
