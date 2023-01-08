import React, { useContext } from "react";
import "./css/header.css";
import { UserContext } from "../../../../context/Context";
import { renderHTML } from "../../../../utils/renderHTML";
import moment from "moment";

const CardHeader = ({
  handleDeletePostAPI,
  post,
  display,
  DisplaySize,
  setDisplaySize,
  title,
}) => {
  const [state] = useContext(UserContext);
  return (
    <div className="card-header">
      <div className="card-sec1">
        <div className="UserName">
          <img
            className="userIMG"
            src={post && post.postedBy.image ? post.postedBy.image.url : ""}
            alt=""
          />
          <div className="User">
            <span className="name">{post.postedBy.username}</span>
            <small className="userNameSub">
              {moment(post.createdAt).fromNow()}
            </small>
          </div>
        </div>
        <div className="Edit mt-1" style={{ visibility: display }}>
          {state && state.user && state.user._id === post.postedBy._id ? (
            <>
              <span className="editIcon" style={{ visibility: "hidden" }}>
                <ion-icon name="create"></ion-icon>
              </span>
              <span
                className="deleteIcon"
                onClick={() => handleDeletePostAPI(post._id, post.file_type)}
              >
                <ion-icon name="trash"></ion-icon>
              </span>
            </>
          ) : (
            ""
          )}

          <span className="moreIcon dropend">
            {" "}
            <ion-icon
              name="ellipsis-vertical"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></ion-icon>
            <div className="btn-group dropend">
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Save Post
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Report
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    More
                  </a>
                </li>
              </ul>
            </div>
          </span>
        </div>
      </div>
      {title && (
        <div className="card-sec2">
          <div className="Inner pt-2" style={{ height: DisplaySize }}>
            {renderHTML(post.content)}
          </div>

          <span
            onClick={() => {
              {
                DisplaySize === "4rem"
                  ? setDisplaySize("100%")
                  : setDisplaySize("4rem");
              }
            }}
            className="more text-danger"
            role="button"
          >
            more
          </span>
        </div>
      )}
    </div>
  );
};

export default CardHeader;
