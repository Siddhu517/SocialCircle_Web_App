import React from "react";
import "../right.css";

const Following = ({ following }) => {
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

export default Following;
