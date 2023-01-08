import React from "react";
import "../right.css";

const Suggested = ({ suggested }) => {
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
                <span className="nav-link UsernameList">
                  {user ? user.username : "Username"}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Suggested;
