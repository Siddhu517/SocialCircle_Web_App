import React from "react";
import { Link } from "react-router-dom";
import "../right.css";

const Suggested = ({ handleUserFollow, suggested }) => {
  return (
    <div className="list-container">
      <ul className="list-unstyled">
        {suggested &&
          suggested.map((user, index) => (
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
                  {user ? user.username : "Username"}
                </Link>
                <button
                  onClick={() => handleUserFollow(user._id)}
                  className="btn btn-primary  btn-sm"
                >
                  Follow
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Suggested;
