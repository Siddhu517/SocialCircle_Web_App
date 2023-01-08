import React from "react";
import { Link } from "react-router-dom";
import "../right.css";
import { toast } from "react-toastify";

const Following = ({ handleUserUnfollow, handleUserFollowing, following }) => {
  const handleUnFollowFriend = async (id) => {
    const res = await handleUserUnfollow(id);
    await handleUserFollowing();
    toast.success(res.data.message);
  };
  return (
    <div className="list-container">
      <ul className="list-unstyled">
        {following &&
          following.map((user, index) => (
            <li key={user._id} className="list">
              <img
                className="userImgList"
                src={user && user.image ? user.image.url : ""}
                alt=""
              />
              <div className="UserDetailsList">
                <Link
                  to={`/friend/${user.username}`}
                  className="nav-link UsernameList"
                >
                  {user ? user.username : "username"}
                </Link>
                <button
                  onClick={() => handleUnFollowFriend(user._id)}
                  className="btn btn-primary  btn-sm"
                >
                  Unfollow
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Following;
