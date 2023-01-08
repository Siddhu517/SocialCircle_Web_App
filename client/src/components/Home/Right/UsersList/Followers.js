import React, {useContext } from "react";
import { Link } from "react-router-dom";
import "../right.css";
import { toast } from "react-toastify";
import { UserContext } from "../../../../context/Context";

const Followers = ({ handleAddFollowers, handleRemoveFollower, followers }) => {
  const [state] = useContext(UserContext);

  const submitAddFollower = async (id) => {
    const res = await handleAddFollowers(id);
    if (res) {
      toast.success(res.data.message);
    }
    toast.error(res.data.error);
  };

  const submitRemoveFollower = async (id) => {
    const res = await handleRemoveFollower(id);
    if (res) {
      toast.success(res.data.message);
    }
    toast.error(res.data.error);
  };

  return (
    <div className="list-container">
      <ul className="list-unstyled">
        {followers &&
          followers.map((user, index) => (
            <li className="list">
              <img
                className="userImgList"
                src={user && user.image ? user.image.url : ""}
                alt=""
              />
              <div className="UserDetailsList">
                <Link
                  to={`/friend/${user.username}`}
                  className="nav-link UsernameList"
                >
                  {user ? user.username : "username"}
                </Link>
                {state &&
                state.user &&
                user.followers &&
                user.followers.includes(state.user._id) ? (
                  <button
                    onClick={() => submitRemoveFollower(user._id)}
                    className="btn btn-primary  btn-sm"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => submitAddFollower(user._id)}
                    className="btn btn-primary  btn-sm"
                  >
                    Add
                  </button>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Followers;
