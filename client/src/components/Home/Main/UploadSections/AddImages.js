import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./addImages.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Images from "./Images";
import { postImages} from "../../../../services/PostAPI";
import { toast } from "react-toastify";

const AddImages = ({ id, handleCreatePost }) => {
  /* ReactQuill text-Box */
  const [content, setContent] = useState("");
  const [postBy, setPostBy] = useState("");

  //console.log(postBy);

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

  const handleDeleteFile = (img) => {
    setFiles(files.filter((e) => e !== img));
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

  /* upload images AWS  */
  const SubmitImages = async () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // Send the request to the server
      const res = await postImages(formData);
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
    const res = await SubmitImages();

    // check if image upload was successful
    if (res.data.status !== "ok") {
      toast.error(res.data.message);
      setIsLoading(false);
      return;
    }

    //pass all files urls to database
    const resFiles = res.data.uploadedImages;
    const file_type = "image";

    const postData = { content, resFiles, file_type, postBy };
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
        className="modal fade AddImages"
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
                      <option  className="" value="public">
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
                  {/* drag-drop-files */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={onChangeFile}
                    className="addCardContent d-flex flex-column justify-content-center align-items-center"
                  >
                    {/* add files in input  */}
                    <input
                      id="files"
                      name="files"
                      accept=".jpg, .jpeg, .png"
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
                      Add Images files
                    </Link>

                    <Link className="smallText nav-link" role="button">
                      or drag and drop
                    </Link>
                  </div>
                  <div className="main">
                    <div className="imagesPreview">
                      <Images
                        files={files}
                        handleDeleteFile={handleDeleteFile}
                      />
                    </div>
                    <div className="resetButton">
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

export default AddImages;
