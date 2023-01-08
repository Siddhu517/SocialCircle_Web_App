import React, { useState} from "react";
import "./left.css";

const FLeft = ({  user }) => {
  const [icon, setIcon] = useState(true);
  const [view, setView] = useState("hidden");

  const handleClick = () => {
    if (icon) {
      setIcon(false);
      setView("");
    } else {
      setIcon(true);
      setView("hidden");
    }
  };

  return (
    <div className="left-container">
      <div className="FriendsDetails">
        <div className="details">
          <div className="friendIMG">
            <img
              className="userIMGF img-fluid"
              src={
                user && user.image
                  ? user.image.url
                  : "https://static.republika.co.id/uploads/member/images/news/bor6mn3jnr.jpg"
              }
              alt=""
            />
          </div>
          <div className="friendDetailView">
            <div className="follow bg-primary text-light">
              <span className="name">Follow</span>
              <span className="value">
                {user && user.followers ? user.followers.length : "0"}
              </span>
            </div>
            <div className="following bg-danger text-light">
              <span className="name">Following</span>
              <span className="value">
                {user && user.following ? user.following.length : "0"}
              </span>
            </div>
            <div className="post bg-success text-light">
              <span className="name">Post</span>
              <span className="value">
                {user && user.posts ? user.posts.length : "0"}
              </span>
            </div>
          </div>
        </div>
        <span className="friendName">
          {user && user.username ? user.username : "-___@User@___-"}
        </span>
      </div>
      <div className="friendDetailsDisplay">
        <span className="text">Friend Personal Details</span>
        <span className="icon" onClick={handleClick}>
          {icon ? (
            <ion-icon name="expand-sharp"></ion-icon>
          ) : (
            <ion-icon name="contract-sharp"></ion-icon>
          )}
        </span>
      </div>
      <div className="FriendsPersonalDetails" style={{ visibility: view }}>
        {user ? (
          <div className="viewData">
            <span className="personalData">{user.username}</span>
            <span className="personalData">
              {user.name ? user.name : "Name"}
            </span>
            <span className="personalData">{user.email}</span>
            <span className="personalData">
              {user.contact ? user.contact : "Contact"}
            </span>
            <span className="personalData">Address</span>
            <span className="personalData">
              {user.city ? user.city : "City"}
            </span>
            <span className="personalData">
              {user.state ? user.state : "State"}
            </span>
            <span className="personalData">
              {user.country ? user.country : "Country"}
            </span>
            <span className="personalData">
              {user.pincode ? user.pincode : "PinCode"}
            </span>
            <span className="personalData">
              {user.gender ? user.gender : "Gender"}
            </span>
            <span className="personalData">
              {user.dateofbirth ? user.dateofbirth : "Date_of_birth"}
            </span>
            <span className="personalData">
              {user.relationship ? user.relationship : "Relationship"}
            </span>
            <span className="personalData">
              {user.education ? user.education : "Education"}
            </span>
            <span className="personalData">
              {user.work ? user.work : "Work"}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default FLeft;
