import React, { useContext } from "react";
import "./setting.css";
import Navbar from "./../components/Home/Navbar/Navbar";
import { UserContext } from "../context/Context";
import { toast } from "react-toastify";
import { deleteUserApi } from "../services/AuthApis";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [state, setState] = useContext(UserContext);

  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete account")) {
      const res = await deleteUserApi();
      if (res.data.status !== "ok") {
        toast.error(res.data.error);
        return;
      }
      window.localStorage.removeItem("auth");
      setState(null);
      toast.success(res.data.message);
      navigate("/login");
    }
  };

  return (
    <div className="container-fluid settings-container">
      <div className="row">
        <Navbar display="hidden" />
      </div>

      <div className="row">
        <div className="col-3 SettingMenu">
          <div className="menuSection">
            <span className="Name">Settings</span>
            <span className="Menu ">Privacy</span>
            <span className="Menu ">Custom</span>
            <span className="Menu ">About</span>
            <span className="Menu ">More</span>
          </div>
        </div>
        <div className="col-9 settingDisplay">
          <div className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-between align-items-center">
                <img
                  className="img"
                  src={
                    state && state.user && state.user.image
                      ? state.user.image.url
                      : ""
                  }
                  alt=""
                />
                <span className="username ms-3">
                  {state && state.user ? state.user.username : "User"}
                </span>
              </div>
              <button className="btn btn-danger" onClick={handleDeleteUser}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
