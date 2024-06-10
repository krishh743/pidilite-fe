import React, { useEffect, useState } from "react";
import logo from "../../../Assets/Images/pidlite-logo.png";
import ham from "../../../Assets/Images/ham.png";
import irm from "../../../Assets/Images/IRMLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddUserByAdmin.css";
import PopupForm from "./PopupForm";
import openeye from "../../../Assets/Images/openeye.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddUsersByAdmin() {
  const location = useLocation();
  const baseUri = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [gameListData, setGameListData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const ongoingGamesResponse = await fetch(`${baseUri}/api/trainer`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `${localStorage.getItem("token")}`,
            'ngrok-skip-browser-warning':'true'
          },
        });

        const data = await ongoingGamesResponse.json();
        setGameListData(data);
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    };

    fetchGames();
  }, []);

  console.log(gameListData, "gameListData");

  const openGame = (game) => {
    console.log("Open game:", game);
  };

  const handleOpenNewGameForm = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${baseUri}/api/trainer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const newUser = await response.json();
      setGameListData([...gameListData, newUser]);
      toast.success("User created successfully!");
      handleClosePopup();
    } catch (error) {
      console.error("Error creating new user:", error);
      toast.error("Error creating new user.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="setupMain">
      <ToastContainer />
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
            href="/admin-setup"
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
          <div className="listContainer">
            <table className="adminListTable">
              <thead>
                <tr className="listTableHeader">
                  <th>Sno</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>User Type</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody className="listTableBody">
                {gameListData.map((users, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{users?.name}</td>
                    <td>{users.phoneNumber}</td>
                    <td>{users.type}</td>
                    <td className="viewColumn">
                      <img
                        className="openEye"
                        onClick={() => openGame(users)}
                        src={openeye}
                        alt="open eye"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="addGameBtn" onClick={handleOpenNewGameForm}>
              Add user
            </button>
            {showPopup && (
              <PopupForm
                onClose={handleClosePopup}
                onSubmit={handleFormSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUsersByAdmin;
