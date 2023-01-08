import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./addDocument.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Documents from "./Documents";
import { postDocuments } from "../../../../services/PostAPI";
import { toast } from "react-toastify";

const AddDocuments = ({ id, handleCreatePost }) => {
  /* ReactQuill text-Box */
  const [content, setContent] = useState("");
  const [postBy, setPostBy] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  /* Accept data of upload fils one / multiple */
  const [files, setFiles] = useState([]);

  /* main section to all data add */
  /* input file data accept */
  const inputRef = useRef();

  /* on click to input file click ref on input element */
  const handleAddFile = () => {
    inputRef.current.click();
  };

  /* drag on files multiple */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteFile = (file) => {
    setFiles(files.filter((e) => e !== file));
  };

  /* accept data of onclick and drag file */
  const onChangeFile = async (e) => {
    e.preventDefault();
    /* all data accept */
    const selectedFiles = e.target.files || e.dataTransfer.files;
    /* images  */
    const selectedFileArray = Array.from(selectedFiles);
    setFiles(selectedFileArray);
  };

  /* clear all Preview files */
  const resetData = () => {
    setFiles([]);
  };

  /* server send data files */
  /* upload images aws */
  const SubmitDocuments = async () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    // console.log("send => ", files);

    try {
      // Send the request to the server
      const res = await postDocuments(formData);
      // console.log(res.data);
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

    if (!content) {
      toast.error("Write content required");
      return;
    }

    handleClick();
    const res = await SubmitDocuments();

    // check if image upload was successful
    if (res.data.status !== "ok") {
      toast.error(res.data.message);
      setIsLoading(false);
      return;
    }

    //pass all files urls to database
    const resFiles = res.data.uploadedDocuments;
    const file_type = "document";


    const postData = { content, resFiles, file_type, postBy };
    // console.log("post uploads =>", postData);

    try {
      //const res = await createPost(postData);
      const res = await handleCreatePost(postData);

      if (res.data.status === "ok") {
        // console.log(res.data);
        setIsLoading(false);
        toast.success(res.data.message);
        setFiles([]);
        setContent("");
        setPostBy("");
      } else {
        setIsLoading(false);
        // console.log(res.data);
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
        className="modal fade AddDocument"
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
                  <div
                    onDragOver={handleDragOver}
                    onDrop={onChangeFile}
                    className="addCardContent d-flex flex-column justify-content-center align-items-center"
                  >
                    <input
                      className=""
                      accept=".pdf"
                      type="file"
                      onChange={onChangeFile}
                      hidden
                      ref={inputRef}
                      multiple
                    />
                    <Link
                      className="iconADD nav-link"
                      role="button"
                      onClick={handleAddFile}
                    >
                      <ion-icon name="duplicate-sharp"></ion-icon>
                    </Link>
                    <Link className="midText nav-link" role="button">
                      Add PDF files
                    </Link>
                    <Link className="smallText nav-link" role="button">
                      or drag and drop
                    </Link>
                  </div>
                  <div className="main">
                    <div className="documentsPreview">
                      <Documents
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

export default AddDocuments;
