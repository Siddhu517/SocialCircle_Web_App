import React, { useState, useContext, useEffect } from "react";
import "./main.css";
import WriteContentModal from "../Main/UploadSections/WriteContentModal";
import AddImages from "../Main/UploadSections/AddImages";
import AddVideos from "../Main/UploadSections/AddVideos";
import AddDocuments from "../Main/UploadSections/AddDocuments";
import "bootstrap/dist/css/bootstrap.min.css";
import CardHeader from "./PostSection/CardHeader";
import CardBody from "./PostSection/CardBody";
import CardFooter from "./PostSection/CardFooter";
import { UserContext } from "../../../context/Context";

const Main = ({
  handleCreatePost,
  handleDeletePostAPI,
  posts,
  handleCreateCommentAPI,
  handleDeleteCommentAPI,
  handleCommentEditAPI,

  handleLikePostAPI,
  handleUnlikePostAPI,

  handleSharePostAPI,
  display,
  marginCom,
}) => {
  const [DisplaySize, setDisplaySize] = useState("4rem");
  const title = "bhgcfx";
  const [state] = useContext(UserContext);

  return (
    <div className="post-container">
      <div className="posts ">
        <div
          className="post-uploadSection "
          style={{ visibility: display, marginTop: marginCom }}
        >
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className=" section-1 d-flex justify-content-between align-items-center">
              <img
                className=" userImage img-fluid"
                src={state && state.user.image ? state.user.image.url : ""}
                alt=""
                style={{ cursor: "pointer" }}
              />
              <div
                className="TextInputBox d-flex justify-content-flex-start align-items-center text-muted ps-3"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#postContentModal"
              >
                write something
              </div>
              <WriteContentModal
                handleCreatePost={handleCreatePost}
                id="postContentModal"
              />
            </div>
            <div className="section-2">
              <div className="section2-1">
                <a
                  href="#"
                  className="section2-01 nav-link d-flex justify-content-center align-items-center"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#liveVideoModal"
                >
                  Add-Images
                </a>
                <AddImages
                  handleCreatePost={handleCreatePost}
                  id="liveVideoModal"
                />
              </div>
              <div className=" section2-1 ">
                <a
                  href="#"
                  className=" section2-01 nav-link d-flex justify-content-center align-items-center"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#photoVideoModal"
                >
                  Add-Videos
                </a>
                <AddVideos
                  handleCreatePost={handleCreatePost}
                  id="photoVideoModal"
                />
              </div>
              <div className=" section2-1">
                <a
                  href="#"
                  className="section2-01 nav-link d-flex justify-content-center align-items-center"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#addDocuments"
                >
                  Add-Documents
                </a>
                <AddDocuments
                  handleCreatePost={handleCreatePost}
                  id="addDocuments"
                />
              </div>
            </div>
          </div>
        </div>

        {posts &&
          posts.map((post) => (
            <>
              <div key={post._id} className="card postView">
                {/* Card Header */}
                <CardHeader
                  handleDeletePostAPI={handleDeletePostAPI}
                  post={post}
                  title={title}
                  display={display}
                  DisplaySize={DisplaySize}
                  setDisplaySize={setDisplaySize}
                />

                {/* card Body */}
                <CardBody post={post} />

                {/* card Footer */}
                <CardFooter
                  post={post}
                  handleCreateCommentAPI={handleCreateCommentAPI}
                  handleDeleteCommentAPI={handleDeleteCommentAPI}
                  handleCommentEditAPI={handleCommentEditAPI}
                  handleLikePostAPI={handleLikePostAPI}
                  handleUnlikePostAPI={handleUnlikePostAPI}
                  handleSharePostAPI={handleSharePostAPI}
                />
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default Main;
