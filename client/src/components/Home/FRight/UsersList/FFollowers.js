import React from "react";
import "../right.css";

const Followers = ({ followers }) => {
  return (
    <div className="list-container">
      <ul className="list-unstyled">
        {followers &&
          followers.map((user, index) => (
            <li className="list">
              <img
                className="userImgList"
                src={user && user.image ? user.image.url : ""}
                alt=""
              />
              <div className="UserDetailsList">
                <span className="nav-link UsernameList">
                  {user ? user.username : "username"}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Followers;
