import React, { useContext } from "react";
import "./left.css";
import { UserContext } from "../../../context/Context";

const Left = () => {
  const [state] = useContext(UserContext);

  return (
    <div className="leftSection">
      <div className="userDetails">
        <img
          className="userImgView"
          src={`${
            state && state.user && state.user.image
              ? state.user.image.url
              : "https://i0.wp.com/nybreaking.com/wp-content/uploads/2022/12/Lensa-AI-apps-Ts-and-Cs-allow-it-to-distribute.jpg"
          }`}
          alt=""
        />
        <span className="UserName">
          -_@
          {state && state.user && state.user.username
            ? state.user.username
            : "User"}
          @_-
        </span>

        <div className="userVisuals">
          <div className="userDetailsVisual1 bg-info">
            <span className="text-light">Follow</span>
            <span className="fs-6">
              {state && state.user && state.user.followers
                ? state.user.followers.length
                : "0"}
            </span>
          </div>
          <div className="userDetailsVisual1 bg-danger">
            <span className="text-light">Post</span>
            <span className="fs-6">
              {" "}
              {state && state.user && state.user.posts
                ? state.user.posts.length
                : "0"}
            </span>
          </div>
          <div className="userDetailsVisual2 bg-warning">
            <span className="text-light">Following</span>
            <span className="fs-6">
              {state && state.user && state.user.following
                ? state.user.following.length
                : "0"}
            </span>
          </div>
        </div>
      </div>

      <div className="adSection">
        <img
          className="img-fluid"
          src={
            state &&
            state.user &&
            state.user.back_images &&
            state.user.back_images.length > 1
              ? state.user.back_images[state.user.back_images.length - 2].url
              : ""
          }
          alt=""
        />
      </div>
    </div>
  );
};

export default Left;
