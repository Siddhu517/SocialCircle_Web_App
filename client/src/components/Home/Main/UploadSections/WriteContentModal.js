import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./writeContent.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputEmoji from "react-input-emoji";
import { toast } from "react-toastify";

const WriteContentModal = ({ id, handleCreatePost }) => {
  const [content, setContent] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [postBy, setPostBy] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleOnEnter = (text) => {
    //console.log("enter", text);
  };

  const SubmitPostServer = async () => {
    try {
      if (!content) {
        toast.error("Add title required");
        return;
      }

      if (!bodyText) {
        toast.error("Write Descriptive message required");
        return;
      }

      setIsLoading(true);
      //pass all files urls to database
      const file_type = "text";

      const postData = { content, bodyText, file_type, postBy };

      //const res = await createPost(postData);
      const res = await handleCreatePost(postData);
      if (res.data.status !== "ok") {
        setIsLoading(false);
        toast.error(res.data.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      //console.log(res.data);
      setBodyText("");
      setContent("");
      setPostBy("");
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error("Error creating post. Please try again.");
    }
  };

  const closeUploading = () => {
    setIsLoading(false);
    setBodyText("");
    setContent("");
    setPostBy("");
  };

  return (
    <div>
      {/* Modal */}
      <div
        className="modal fade createPost"
        id={id}
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header ">
              <h5 className="modal-title">Create Post</h5>
              <button
                type="button"
                className="btn-close closeButton"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-flex-start align-items-center">
                <div className="d-flex justify-content-flex-center align-items-center">
                  <img className="userImg" src="" alt="" />
                  <div className="d-flex flex-column">
                    <Link className="nav-link" role="button">
                      UserName
                    </Link>

                    <select
                      className="form-select form-select-sm dropdownButton"
                      aria-label="form-select-sm example"
                      name="postBy"
                      defaultValue={"public"}
                      onChange={(e) => setPostBy(e.target.value)}
                    >
                      <option selected className="" value="public">
                        Public
                      </option>
                      <option value="friends">Friends</option>
                      {/* <option value="Specific-friends">Specific friends</option> */}
                      <option value="only-me">Only me</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="backgroundChange">
                <InputEmoji
                  value={content}
                  onChange={setContent}
                  onEnter={handleOnEnter}
                  placeholder="Type Heading Text..."
                  className="inputEmoji"
                />

                <div className="mt-2 mb-2 d-flex justify-content-center align-items-center">
                  <div className="card">
                    <div className="card-body cardBodyC pb-3">
                      <form className="form-group">
                        <ReactQuill
                          theme="snow"
                          value={bodyText}
                          onChange={setBodyText}
                          className="reactQuill"
                          placeholder="Type Descriptive message..."
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center align-items-center">
              {/*  <button
                onClick={SubmitPostServer}
                className="btn btn-primary w-100"
                type="button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm me-3 fs-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                Post
              </button> */}
              <div class="btn-group w-100">
                <button
                  onClick={SubmitPostServer}
                  className="btn btn-primary w-100"
                  type="button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm me-3 fs-4"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Post
                </button>
                <span
                  onClick={closeUploading}
                  className="btn btn-danger w-25 "
                  data-bs-dismiss="modal"
                >
                  Close
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteContentModal;
