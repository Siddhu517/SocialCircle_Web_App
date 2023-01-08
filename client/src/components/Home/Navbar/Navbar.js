import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { toast } from "react-toastify";
import { UserContext } from "../../../context/Context";
import { searchUser } from "../../../services/AuthApis";

const Navbar = ({ display }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [search, setSearch] = useState("");
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const searchData = { search };
        const res = await searchUser(searchData);
        console.log(res.data);
        setRecommendations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (search) {
      fetchResults();
    } else {
      setRecommendations([]);
    }
  }, [search]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout ?")) {
      window.localStorage.removeItem("auth");
      setState(null);
      toast.success("Logout successfully");
      window.navigator = "/login";
    }
  };

  return (
    <div className="navBar">
      {/* sec1 */}
      <div className="AppName">
        <Link className="nav-link nav-link" to="/">
          <span className="BrandName">SocialCircle</span>
        </Link>
      </div>

      {/* sec2 */}
      <div className="search-container " style={{ visibility: display }}>
        <div className="searchBar dropdown">
          <input
            placeholder="Search..."
            type="text"
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="dropdownMenuButton45"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          />
          <ion-icon name="search"></ion-icon>
          <ul
            className="dropdown-menu searchRecommendationBox"
            aria-labelledby="dropdownMenuButton45"
          >
            {recommendations &&
              recommendations
                .filter(
                  (e) => e._id !== state.user._id
                ) /* filter to search result not display current user */
                .map((user) => (
                  <li key={user._id}>
                    <Link
                      className="dropdown-item nav-link item"
                      to={`/friend/${user.username}`}
                    >
                      <img
                        className="img-fluid"
                        src={user && user.image ? user.image.url : ""}
                        alt=""
                      />
                      <span className="Username">
                        {user ? user.username : ""}
                      </span>
                    </Link>
                  </li>
                ))}
          </ul>
        </div>
      </div>

      {/* sec3 */}
      <div className="userMenu-container  ">
        <div className="userDetails dropdown">
          <span
            className="username"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {state && state.user && state.user.username
              ? state.user.username
              : "Username"}
          </span>
          <img
            className="Img img-fluid"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            src={`${
              state && state.user && state.user.image
                ? state.user.image.url
                : ""
            }`}
            alt=""
          />

          <ul
            className="dropdown-menu   mt-2"
            aria-labelledby="dropdownMenuButton1"
          >
            <li>
              <Link to="/" className="dropdown-item  active">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="dropdown-item">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/settings" className="dropdown-item">
                Settings
              </Link>
            </li>
            <li>
              <Link to="" className="dropdown-item" onClick={handleLogout}>
                LogOut
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
