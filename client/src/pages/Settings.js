import React from "react";
import "./setting.css";
import Navbar from "./../components/Home/Navbar/Navbar";

const Settings = () => {
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
        <div className="col-9 settingDisplay">Z</div>
      </div>
    </div>
  );
};

export default Settings;
