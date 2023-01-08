import React, { useState, useContext } from "react";
import "./right.css";
import Followers from "./UsersList/Followers";
import Following from "./UsersList/Following";
import Suggested from "./UsersList/Suggested";
import { UserContext } from "../../../context/Context";

const Right = ({
  handleAddFollowers,
  handleRemoveFollower,
  handleUserFollow,
  handleUserUnfollow,
  followers,
  following,
  suggested,
  handleUserFollowers,
  handleUserFollowing,
  handleFindPeople,
}) => {
  const [viewList, setViewList] = useState("suggested");

  const [state] = useContext(UserContext);

  const handleFollowTab = async () => {
    try {
      setViewList("follow");
      await handleUserFollowers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollowingTab = async () => {
    try {
      setViewList("following");
      await handleUserFollowing();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSuggestedTab = async () => {
    try {
      setViewList("suggested");
      await handleFindPeople();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="rightSection">
      <div className="adSection">
        <img
          className="img-fluid"
          src={
            state && state.user && state.user.back_image
              ? state.user.back_image.url
              : ""
          }
          alt=""
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
            handleAddFollowers={handleAddFollowers}
            handleRemoveFollower={handleRemoveFollower}
            followers={followers}
          />
        ) : viewList === "following" ? (
          <Following
            handleUserUnfollow={handleUserUnfollow}
            following={following}
            handleUserFollowing={handleUserFollowing}
          />
        ) : viewList === "suggested" ? (
          <Suggested
            suggested={suggested}
            handleUserFollow={handleUserFollow}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Right;
