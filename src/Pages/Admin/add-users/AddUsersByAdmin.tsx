import React, { useEffect, useState } from "react";
import logo from "../../../Assets/Images/pidlite-logo.png";
import ham from "../../../Assets/Images/ham.png";
import irm from "../../../Assets/Images/DTXLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddUserByAdmin.css";
import PopupForm from "./PopupForm";
import openeye from "../../../Assets/Images/openeye.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteDialog from "./ConfirmationBox";

function AddUsersByAdmin() {
  const location = useLocation();
  const baseUri = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [gameListData, setGameListData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const ongoingGamesResponse = await fetch(`${baseUri}/api/trainer`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
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

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${baseUri}/api/trainer/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setGameListData(gameListData.filter(user => user.id !== selectedUserId));
      toast.error("User deleted successfully!");
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error while deleting user.");
    }
  };

  const handleOpenConfirmDelete = (userId) => {
    setSelectedUserId(userId);
    setShowConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setShowConfirmDelete(false);
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
          {/* <a href="/training-games" className="setupSideBarItem">
            Training Games
          </a> */}
          <a
            href="/admin-setup"
            className={`setupSideBarItem ${
              location.pathname === "/setup" ? "activeSidebarLink" : ""
            }`}
          >
            Setup
          </a>
          {/* <a href="/gameplay" className="setupSideBarItem">
            Game Play
          </a>
          <a href="/leaderboard" className="setupSideBarItem">
            Players & Leaderboard
          </a> */}
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
                  <th>Delete</th>
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
                    <td>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                        className="Delete-user"
                        onClick={() => handleOpenConfirmDelete(users?.id)}
                      >
                        <path d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.328125 3.671875 14 4.5 14 L 10.5 14 C 11.328125 14 12 13.328125 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 5 5 L 6 5 L 6 12 L 5 12 Z M 7 5 L 8 5 L 8 12 L 7 12 Z M 9 5 L 10 5 L 10 12 L 9 12 Z"></path>
                      </svg>
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
            {showConfirmDelete && (
              <ConfirmDeleteDialog
                onClose={handleCloseConfirmDelete}
                onDelete={handleDeleteUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUsersByAdmin;
