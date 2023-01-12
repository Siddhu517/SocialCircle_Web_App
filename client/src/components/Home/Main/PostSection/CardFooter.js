import React, { useState, useContext, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import "./css/footer.css";
import { UserContext } from "../../../../context/Context";
import moment from "moment";
import { toast } from "react-toastify";

const CardFooter = ({
  post,
  handleCreateCommentAPI,
  handleDeleteCommentAPI,
  handleCommentEditAPI,
  handleLikePostAPI,
  handleUnlikePostAPI,
  handleSharePostAPI,
}) => {
  const [state] = useContext(UserContext);
  const [editComment, setEditComment] = useState("");
  const [idMatch, setIdmatch] = useState("");

  /* create comment */
  const [comment, setComment] = useState("");

  const [colorS, setColorS] = useState("red");
  const [colorC, setColorC] = useState("red");

  useEffect(() => {
    if (post.shares.length > 0) {
      setColorS("blue");
    }
    if (post.comments.length > 0) {
      setColorC("blue");
    }
  }, [post]);

  /* edit comments  */
  const handleSubmit = async (id, editComment, itemId) => {
    const res = await handleCommentEditAPI(id, editComment, itemId);
    if (res.data.status === "ok") {
      setEditComment("");
      setIdmatch("");
    }
  };

  /* create comment  */
  const handleSubmitCreateComment = async (id) => {
    setComment("");
    const res = await handleCreateCommentAPI(id, comment);
    if (res.data.status === "ok") {
    }
    toast.error(res.data.error);
  };

  return (
    <div className="card-footer m-0 p-0">
      <div className="footerSec1 ">
        {state &&
        state.user &&
        post.likes &&
        post.likes.includes(state.user._id) ? (
          <div className="like" onClick={() => handleUnlikePostAPI(post._id)}>
            <ion-icon
              name="thumbs-up-sharp"
              style={{ color: "blue" }}
            ></ion-icon>
            {post.likes.length}
            <span className="ms-2">Like</span>
          </div>
        ) : (
          <div
            className="like"
            onClick={() => {
              handleLikePostAPI(post._id);
            }}
          >
            <ion-icon
              name="thumbs-up-sharp"
              style={{ color: "red" }}
            ></ion-icon>
            {post.likes.length}
            <span className="ms-2">Like</span>
          </div>
        )}

        <div
          className="comments"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapse-id"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          <ion-icon
            name="chatbubble-ellipses-sharp"
            style={{ color: colorC }}
          ></ion-icon>{" "}
          {post.comments.length} <span className="ms-2">Comments</span>
        </div>

        <div className="share" onClick={() => handleSharePostAPI(post._id)}>
          <ion-icon
            name="arrow-redo-sharp"
            style={{ color: colorS }}
          ></ion-icon>{" "}
          {post.shares.length} <span className="ms-2">Share</span>
        </div>
      </div>

      <div className="footerSec2 collapse" id="collapse-id">
        <div className="PostComments">
          <div className="writeComment">
            <InputEmoji
              value={comment}
              onChange={setComment}
              onEnter={() => handleSubmitCreateComment(post._id)}
              placeholder="Type Heading Text..."
            />
          </div>
          <ul className="list-unstyled">
            {post &&
              post.comments.map((item, index) => (
                <li key={item._id}>
                  <div className="userComment">
                    <img
                      className="userIMGC"
                      src={`${item?.image?.url || ""}`}
                      alt=""
                    />
                    <span className="CommentSec">
                      <span className="userName text-primary">
                        {item.username}
                      </span>
                      <small className="created">
                        {moment(item.createdAt).fromNow()}
                      </small>
                      {post && item.created === idMatch ? (
                        <span className="editCommentBox">
                          <div className="input-group">
                            <textarea
                              className="form-control editComment"
                              aria-label="With textarea"
                              onChange={(e) => setEditComment(e.target.value)}
                              defaultValue={item.comment}
                            />
                            <span
                              className="input-group-text bg-success text-light"
                              onClick={() =>
                                handleSubmit(post._id, editComment, item._id)
                              }
                            >
                              submit
                            </span>
                            <span
                              className="input-group-text bg-danger text-light"
                              onClick={() => {
                                setEditComment("");
                                setIdmatch("");
                              }}
                            >
                              X
                            </span>
                          </div>
                        </span>
                      ) : (
                        ""
                      )}

                      {item ? (
                        <span className="comment">{item.comment}</span>
                      ) : (
                        ""
                      )}
                    </span>
                    {state &&
                      state.user &&
                      state.user._id === item.postedBy._id && (
                        <div className="handleComment">
                          <span
                            className="editIconC"
                            onClick={() => {
                              setIdmatch(`${item.created}`);
                            }}
                          >
                            <ion-icon name="create"></ion-icon>
                          </span>
                          <span
                            className="deleteIconC"
                            onClick={() =>
                              handleDeleteCommentAPI(post._id, item._id)
                            }
                          >
                            <ion-icon name="trash"></ion-icon>
                          </span>
                        </div>
                      )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CardFooter;
