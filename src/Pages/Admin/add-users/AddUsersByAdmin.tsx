import React from "react";
import logo from "../../../Assets/Images/pidlite-logo.png";
import ham from "../../../Assets/Images/ham.png";
import irm from "../../../Assets/Images/IRMLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddUserByAdmin.css"

function AddUsersByAdmin() {
  const location = useLocation();

  const [window, setWindow] = React.useState("games-list");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="setupMain">
      <div className="nav">
        <div className="companyLogos">
          <img src={irm} alt="" className="irm" />
          <img src={logo} alt="" className="logo" />
        </div>
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
        <img src={ham} alt="" className="ham" />
      </div>

      <div className="setupPageContent">
        <div className="setupSideBar">
          {/* <a href="/add-users" className="setupSideBarItem">Add Users</a> */}
          <a
            href="/admin-add-user"
            className={`setupSideBarItem ${
              location.pathname === "/admin-add-user" ? "activeSidebarLink" : ""
            }`}
          >
            Add Users
          </a>
          <a href="/training-games" className="setupSideBarItem">
            Training Games
          </a>
          <a
            href="/setup"
            className={`setupSideBarItem ${
              location.pathname === "/setup" ? "activeSidebarLink" : ""
            }`}
          >
            Setup
          </a>
          <a href="/gameplay" className="setupSideBarItem">
            Game Play
          </a>
          <a href="/leaderboard" className="setupSideBarItem">
            Players & Leaderboard
          </a>
        </div>

        <div className="admin-add-user">


            dkljskafjksdhfjh
        </div>
      </div>
    </div>
  );
}

export default AddUsersByAdmin;
