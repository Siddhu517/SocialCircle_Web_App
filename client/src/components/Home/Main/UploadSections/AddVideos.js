import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./addVideos.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Videos from "./Videos";
import { toast } from "react-toastify";
import { postVideos} from "../../../../services/PostAPI";

const AddVideos = ({ id, handleCreatePost }) => {
  /* ReactQuill text-Box */
  const [content, setContent] = useState("");
  const [postBy, setPostBy] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  /* Accept data of uploaded files, one or multiple */
  const [files, setFiles] = useState([]);

  /* Input file data accept */
  const inputRef = useRef();

  /* On click, reference the input element */
  const handleAddFile = () => {
    inputRef.current.click();
  };

  /* Handle drag and drop of multiple files */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /* Handle deleting a file */
  const handleDeleteFile = (item) => {
    setFiles(files.filter((e) => e !== item));
  };

  /* Accept data on file input change or drag and drop */
  const onChangeFile = async (e) => {
    e.preventDefault();

    /* Get all selected files */
    const selectedFiles = e.target.files || e.dataTransfer.files;
    const selectedFileArray = Array.from(selectedFiles);
    setFiles(selectedFileArray);
  };

  /* clear all Preview files */
  const resetData = () => {
    setFiles([]);
  };

  /* server send data files */

  /* upload images aws */
  const SubmitVideos = async () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    // console.log("send => ", files);

    try {
      // Send the request to the server
      const res = await postVideos(formData);
      //console.log(res.data);
      toast.success(res.data.message);
      return res;
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error("Error uploading files. Please try again.");
    }
  };

  const closeUploading = () => {
    setIsLoading(false);
    setFiles([]);
    setContent("");
    setPostBy("");
  };

  /* post data server */
  const SubmitPostServer = async () => {
    if (!files) {
      toast.error("Add Upload Files required");
      return;
    }

    if (!content.length) {
      toast.error("Write content required");
      return;
    }

    handleClick();

    const res = await SubmitVideos();

    //check if upload success
    if (res.data.status !== "ok") {
      toast.error(res.data.message);
      setIsLoading(false);
      return;
    }

    //pass all files urls to database
    const resFiles = res.data.uploadedVideos;
    const file_type = "video";

    const postData = { resFiles, content, file_type, postBy };
    //console.log("post uploads =>", postData);

    try {
      //const res = await createPost(postData);
      const res = await handleCreatePost(postData);
      if (res.data.status === "ok") {
        //console.log(res.data);
        setIsLoading(false);
        toast.success(res.data.message);
        setFiles([]);
        setContent("");
        setPostBy("");
      } else {
        setIsLoading(false);
        //console.log(res.data);
        toast.error(res.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error("Error creating post. Please try again.");
    }
  };

  return (
    <div>
      {/* Modal */}
      <div
        className="modal fade AddVideos"
        id={id}
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
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
                  <img src="" alt="" className="userImg" />
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
                      <option className="" value="public">
                        Public
                      </option>
                      <option value="friends">Friends</option>

                      <option value="only-me">Only me</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* textarea */}
              <div className="textAreaCard mt-2">
                <div className="cardBook d-flex justify-content-center align-items-center">
                  <div className="card">
                    <div className="card-body pb-3">
                      <form className="form-group">
                        <ReactQuill
                          theme="snow"
                          value={content}
                          onChange={setContent}
                          className="reactQuill"
                        />
                      </form>
                    </div>
                  </div>
                </div>

                <div className="addCard mt-2">
                  {/* drag-drop-files */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={onChangeFile}
                    className="addCardContent d-flex flex-column justify-content-center align-items-center"
                  >
                    {/* add files in input  */}
                    <input
                      className=""
                      accept=".mp4"
                      type="file"
                      onChange={onChangeFile}
                      hidden
                      ref={inputRef}
                      multiple
                    />
                    {/* onclick to add file of input with useRef */}
                    <Link
                      className="iconADD nav-link"
                      role="button"
                      onClick={handleAddFile}
                    >
                      <ion-icon name="duplicate-sharp"></ion-icon>
                    </Link>
                    <Link className="midText nav-link" role="button">
                      Add Videos files
                    </Link>
                    <Link className="smallText nav-link" role="button">
                      or drag and drop
                    </Link>
                  </div>
                  <div className="main">
                    <div className="videosPreview">
                      <Videos
                        files={files}
                        handleDeleteFile={handleDeleteFile}
                      />
                    </div>
                    <div className="resetButton">
                      {/* Reset-Display-Data */}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={resetData}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center align-items-center">
              <div className="btn-group w-100">
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
                <button
                  onClick={closeUploading}
                  className="btn btn-danger w-25 "
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVideos;
