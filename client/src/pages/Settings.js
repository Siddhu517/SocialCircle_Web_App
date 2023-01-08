import React from "react";
import "./setting.css";
import Navbar from "./../components/Home/Navbar/Navbar";

const Settings = () => {
  return (
    <div className="settings-container">
      <Navbar display="hidden" />
      <div className="settingSection">
        <div className="menuSection">
          <span className="Name">Settings</span>
          <span className="Menu ">Privacy</span>
          <span className="Menu ">Custom</span>
          <span className="Menu ">About</span>
          <span className="Menu ">More</span>
        </div>
        <div className="viewSection"></div>
      </div>
    </div>
  );
};

export default Settings;
