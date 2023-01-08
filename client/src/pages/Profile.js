import React, { useState, useRef, useEffect, useContext } from "react";
import "./profile.css";
import Navbar from "../components/Home/Navbar/Navbar";
import {
  profileUpdate,
  profileImageUpdate,
  validateUser,
  currentUser,
  profileBackImageUpdate,
} from "../services/AuthApis";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/Context";

const Profile = () => {
  const [passwordValidate, setPasswordValidate] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    const fetch = async () => {
      await handleUpdateStateUser();
    };
    fetch();
  }, []);

  const handleUpdateStateUser = async () => {
    const { data } = await currentUser();
    await stateUpdate(data);
  };

  /* user image upload */
  const [upload, setUpload] = useState(false);

  /* background image edit */
  const [loading, setLoading] = useState(false);
  const [uploadBack, setUploadBack] = useState(false);

  const [files, setFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const stateUpdate = async (data) => {
    let auth = JSON.parse(localStorage.getItem("auth"));
    auth.user = data.user;
    localStorage.setItem("auth", JSON.stringify(auth));
    //update Context
    setState({ ...state, user: data.user });
    var res = "stateUpdated";
    return res;
  };

  const [update, setUpdate] = useState({
    username: "",
    email: "",
    contact: "",
    gender: "",
    work: "",
    name: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    education: "",
    dateofbirth: "",
    relationship: "",
  });

  /* profile update */

  const handleChange = (e) => {
    setUpdate({ ...update, [e.target.name]: e.target.value });
  };

  /* server update profile */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      /* validatate */
      const res = await HandleValidateUser();

      if (res.data.status !== "ok") {
        setIsLoading(false);
        return;
      }

      const resUpdate = await profileUpdate(update);
      if (resUpdate.data.status !== "ok") {
        toast.error(resUpdate.error);
        return;
      }
      await stateUpdate(resUpdate.data);
      toast.success(resUpdate.data.message);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  /* validate user  */
  const HandleValidateUser = async () => {
    try {
      if (!passwordValidate || !confirmPassword) {
        toast.error("Enter password and ConfirmPassword");
        setIsLoading(false);
        return;
      }

      if (passwordValidate !== confirmPassword) {
        toast.error("Password not match");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const data = { passwordValidate };
      const res = await validateUser(data);

      if (res.data.status === "ok") {
        setIsLoading(true);
        toast.success(res.data.message);
        return res;
      } else {
        setIsLoading(false);
        toast.error(res.data.error);
        return;
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  /* password change click to redirect reset password page */

  const navigate = useNavigate();

  const handleResetPassword = () => {
    try {
      let answer = window.confirm("are you change password ? ");
      if (answer) {
        navigate("/reset-password");
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* Profile image update */

  const onChangeFile = async (e) => {
    e.preventDefault();
    setUploadBack(false);
    try {
      /* all data accept */
      const selectedFiles = e.target.files;
      /* images  */
      const selectedFileArray = Array.from(selectedFiles);
      setFiles(selectedFileArray);
      setUpload(true);
      /* check image upload back or not */
    } catch (err) {
      setUpload(false);
      console.log(err);
    }
  };

  const onChangeFileBackImg = async (e) => {
    e.preventDefault();
    setUpload(false);
    try {
      /* all data accept */
      const selectedFiles = e.target.files;
      /* images  */
      const selectedFileArray = Array.from(selectedFiles);
      setFiles(selectedFileArray);
      setUploadBack(true);
      /* check image upload back or not */
    } catch (err) {
      setUploadBack(false);
      console.log(err);
    }
  };

  const inputRef = useRef();

  const handleAddFile = async () => {
    inputRef.current.click();
  };

  /* background image edit */

  const inputBackRef = useRef();

  const handleAddFileBackImg = async () => {
    inputBackRef.current.click();
  };

  /* submit server */
  /* Profile Image Edit */
  const submitEditImage = async () => {
    setIsLoading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // Send the request to the server

      const { data } = await profileImageUpdate(formData);
      //console.log("data =>", data);
      await stateUpdate(data);
      if (data.status === "ok") {
        setIsLoading(false);
        setUpload(false);
        toast.success(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      setUpload(false);
      toast.error("Error uploading files. Please try again.");
      console.log(err);
    }
  };

  /* Profile Background Image Edit */
  const submitEditImageBack = async () => {
    setLoading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // Send the request to the server

      const { data } = await profileBackImageUpdate(formData);

      await stateUpdate(data);
      if (data.status === "ok") {
        setLoading(false);
        setUploadBack(false);
        toast.success(data.message);
      }
    } catch (err) {
      setLoading(false);
      setUploadBack(false);
      toast.error("Error uploading files. Please try again.");
      console.log(err);
    }
  };

  return (
    <div className="profilepage container-fluid m-0 p-0">
      <Navbar display="hidden" />
      <div className="profileSections">
        <div className="profileLeft">
          <img
            className="UserprofileImg img-fluid"
            src={
              state && state.user && state.user.image
                ? state.user.image.url
                : "https://i0.wp.com/nybreaking.com/wp-content/uploads/2022/12/Lensa-AI-apps-Ts-and-Cs-allow-it-to-distribute.jpg"
            }
            alt=""
          />
          <div className="editImg">
            <span>Edit Image</span>
            {/* add files in input  */}
            <input
              id="files"
              name="files"
              accept=".jpg, .jpeg, .png"
              type="file"
              onChange={onChangeFile}
              hidden
              ref={inputRef}
            />
            {/* onclick to add file of input with useRef */}
            {upload ? (
              <button
                className="btn btn-sm btn-primary"
                onClick={submitEditImage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm me-3 fs-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                Click Update
              </button>
            ) : (
              <span role="button" onClick={handleAddFile}>
                <ion-icon name="images-outline"></ion-icon>
              </span>
            )}
          </div>
        </div>
        <div className="profileMain">
          <img
            className="userBackgroungIMG img-fluid"
            src={
              state && state.user && state.user.back_image
                ? state.user.back_image.url
                : "https://i.pinimg.com/originals/cf/35/69/cf3569f66fe1a15f834047f1fa642962.jpg"
            }
            alt=""
          />
          <span className="backImg">
            <div className="editImg">
              {/* add files in input  */}
              <input
                id="files"
                name="files"
                accept=".jpg, .jpeg, .png"
                type="file"
                onChange={onChangeFileBackImg}
                hidden
                ref={inputBackRef}
              />
              {/* onclick to add file of input with useRef */}
              {uploadBack ? (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={submitEditImageBack}
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-3 fs-4"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Update
                </button>
              ) : (
                <span
                  role="button"
                  className="iconBackImg"
                  onClick={handleAddFileBackImg}
                  style={{ color: "blue" }}
                >
                  <ion-icon name="images-outline"></ion-icon>
                </span>
              )}
            </div>
          </span>

          <div className="userDetailsEdit">
            <form className="form" onSubmit={handleSubmit}>
              <div className="formSection">
                <div className="formSec1">
                  <div className="form-group">
                    <label className="form-label">Name:</label>
                    <input
                      className="form-control inputForm"
                      type="text"
                      placeholder="Name"
                      name="name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password:</label>
                    <div
                      className="passwordSec ps-3"
                      disabled
                      onClick={handleResetPassword}
                    >
                      **************
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                      className="form-control inputForm"
                      type="email"
                      placeholder="email"
                      name="email"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile_No:</label>
                    <input
                      className="form-control inputForm"
                      type="number"
                      placeholder="mobile-no"
                      name="contact"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group selectForm mt-3">
                    <select
                      className="form-select"
                      id="inputGroupSelect56"
                      aria-label="Example select with button addon "
                      name="gender"
                      defaultValue={"Gender"}
                      onChange={handleChange}
                    >
                      <option value="Gender">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work:</label>
                    <input
                      className="form-control inputForm"
                      type="text"
                      placeholder="Work"
                      name="work"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="formSec2">
                  <div className="form-group">
                    <label className="form-label">UserName</label>

                    <input
                      className="form-control inputForm"
                      type="text"
                      placeholder="username"
                      name="username"
                      onChange={handleChange}
                    />
                  </div>
                  <label className="form-label labelAddr mt-1">Address:</label>
                  <div className="form-group address">
                    <input
                      className="form-control addr"
                      type="text"
                      placeholder="City/Area"
                      name="city"
                      onChange={handleChange}
                    />
                    <input
                      className="form-control addr"
                      type="text"
                      placeholder="State"
                      name="state"
                      onChange={handleChange}
                    />
                    <input
                      className="form-control addr"
                      type="text"
                      placeholder="Country"
                      name="country"
                      onChange={handleChange}
                    />
                    <input
                      className="form-control addr"
                      type="number"
                      placeholder="PinCode"
                      name="pincode"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Education:</label>
                    <input
                      className="form-control inputForm"
                      type="text"
                      placeholder="Education"
                      name="education"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date_of_Birth:</label>
                    <input
                      className="form-control inputForm"
                      type="date"
                      placeholder="dateofbirth"
                      name="dateofbirth"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group selectForm mt-3">
                    <select
                      className="form-select form-group "
                      id="inputGroupSelect04"
                      aria-label="Example select with button addon"
                      name="relationship"
                      onChange={handleChange}
                      defaultValue={"relationship"}
                    >
                      <option value="relationship" className="mt-2">
                        Relationship
                      </option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                {/* Modal */}
                <div
                  className="modal fade sharemodal"
                  id="share-modal22"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabIndex={-1}
                  aria-labelledby="staticBackdropLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id="staticBackdropLabel"
                        >
                          Password Confirmation
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body">
                        <div className="formPassword-check">
                          <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                              className="form-control"
                              type="password"
                              value={passwordValidate}
                              onChange={(e) =>
                                setPasswordValidate(e.target.value)
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              ConfirmPassword
                            </label>
                            <input
                              className="form-control"
                              value={confirmPassword}
                              type="password"
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <span
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </span>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span
                              className="spinner-border spinner-border-sm me-3 fs-4"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : null}
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="btn-group w-75 mb-4">
                <span
                  className="btn btn-primary w-75"
                  data-bs-toggle="modal"
                  data-bs-target="#share-modal22"
                >
                  Update Profile
                </span>
              </div>
            </form>
          </div>
        </div>
        {state && state.user ? (
          <>
            <div className="profileRight">
              <div className="userPersonalDetails">
                <div className="detailBox">
                  <small className="name">Username</small>
                  <div className="detail">
                    {state.user.username ? state.user.username : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">Name</small>
                  <div className="detail">
                    {state.user.name ? state.user.name : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">Email</small>
                  <div className="detail">
                    {state.user.email ? state.user.email : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">Contact</small>
                  <div className="detail">
                    {state.user.contact ? state.user.contact : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">Education</small>
                  <div className="detail">
                    {state.user.education ? state.user.education : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">Work</small>
                  <div className="detail">
                    {state.user.work ? state.user.work : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">Gender</small>
                  <div className="detail">
                    {state.user.gender ? state.user.gender : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">DateOfBirth</small>
                  <div className="detail">
                    {state.user.dateofbirth ? state.user.dateofbirth : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">Relationship</small>
                  <div className="detail">
                    {state.user.relationship ? state.user.relationship : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">City</small>
                  <div className="detail">
                    {state && state.user.address && state.user.address.city
                      ? state.user.address.city
                      : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">State</small>
                  <div className="detail">
                    {state && state.user.address && state.user.address.state
                      ? state.user.address.state
                      : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">Country</small>
                  <div className="detail">
                    {state && state.user.address && state.user.address.country
                      ? state.user.address.country
                      : ""}
                  </div>
                </div>

                <div className="detailBox">
                  <small className="name">PinCode</small>
                  <div className="detail">
                    {state && state.user.address && state.user.address.pincode
                      ? state.user.address.pincode
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Profile;
