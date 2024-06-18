import React, { useEffect } from "react";
import searchIcon from "../../../Assets/Images/searchIcon.png";
import filterIcon from "../../../Assets/Images/filterIcon.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./Setup.css";
import { ToastContainer, toast } from "react-toastify";

import { Audio, Oval } from "react-loader-spinner";
import Popup from "reactjs-popup";
import openeye from "../../../Assets/Images/openeye.png";

import ImageUploader from "react-image-upload";
import ConfirmDeleteDialog from "../add-users/ConfirmationBox";

interface gameOverview {
  id: number | null | string;
  gameType: string;
  variationName: string;
  mobileBanner: string;
  siteBanner: string;
  isNewGame: boolean;
  productImage: string;
  additionalDetails: {
    backgroundImage: string;
    trainerBackgroundImage: string;
    playerBackgroundImage: string;
    img2: string;
    img6: string;
    img12: string;
    img16: string;
    img21: string;
    img25: string;
    img28: string;
    img33: string;
    img38: string;
    img41: string;
    img45: string;
    img48: string;
    img51: string;
    img58: string;
  };
}

const GamesList = ({ setWindow, window }) => {
  const location = useLocation();

  const baseUri = process.env.REACT_APP_BASE_URL;

  const [gameListData, setGameListData] = React.useState([]);

  const [openPopup, setOpenPopup] = React.useState(false);

  const [previewedImage, setPreviewedImage] = React.useState("");
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  //   const location = useLocation();
  const navigate = useNavigate();
  //   const appUrl = process.env.REACT_APP_WEBSITE_URL;
  //   const baseUri = process.env.REACT_APP_BASE_URL;

  const [previewedGame, setPreviewedGame] = React.useState<GameOverview>({
    id: null,
    gameType: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  const [openedGame, setOpenedGame] = React.useState<any>({
    id: null,
    gameType: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  // const [gameListData, setGameListData] = useState([]);
  const [participantsList, setParticipantsList] = React.useState([]);
  const [rankingsList, setRankingsList] = React.useState([]);
  const [gameId, setGameId] = React.useState<number | null | string>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewImageSrc, setPreviewImageSrc] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;

  const fetchGamesList = async () => {
    try {
      const gamelistResponse = await fetch(`${baseUri}/api/variation/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const gamesListResdata = await gamelistResponse.json();
      console.log("gamelistResponse", gamesListResdata);
      setGameListData(gamesListResdata);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGamesList();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  const openGame = async (game) => {
    handlePreviewGame(game);
    setGameId(null); // Reset QR
    if (previewedGame.id !== null) {
      setPreviewedGame({
        id: null,
        gameType: "",
        variationName: "",
        additionalDetails: {
          backgroundImage: "",
        },
      });
    }
    setOpenedGame({
      id: game.id,
      gameType: game.gameType,
      variationName: game.variationName,
      additionalDetails: {
        backgroundImage: game.additionalDetails.backgroundImage,
      },
    });

    // Call handlePreviewGame to show preview
    // await handlePreviewGame(game);
  };

  const launchGame = async (gameId: number | null | string) => {
    setIsLoading(true);
    //  setWindow('ongoing-games')
    redirectOngoing("ongoing-games");
    try {
      const launchResponse = await fetch(`${baseUri}/api/gameplay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          variationId: gameId,
        }),
      });

      const launchResData = await launchResponse.json();
      setIsLoading(false);
      setGameId(launchResData.url);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };

  const handlePreviewGame = async (game: GameOverview) => {
    const image = await fetch(
      `${baseUri}/download/${game.additionalDetails.backgroundImage}`,
      {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const imageBlob = await image.blob();
    setPreviewImageSrc(URL.createObjectURL(imageBlob));

    setPreviewedGame({
      id: game.id,
      gameType: game.gameType,
      variationName: game.variationName,
      additionalDetails: {
        backgroundImage: game.additionalDetails.backgroundImage,
      },
    });
  };

  const handleFullScreenSpectateGame = () => {
    if (gameId === null) {
      return;
    }
    navigate(`/game-spectate/${gameId}`);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleTimeString("en-US", options);
  };
  const reversedArchivesListData = [...gameListData].reverse();

  const totalPages = Math.ceil(reversedArchivesListData.length / rowsPerPage);
  const currentData = reversedArchivesListData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  // console.log(currentData, "currentData");

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleChangeTab = (tab) => {
    setWindow(tab);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `${baseUri}/api/variation/${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setGameListData(
        gameListData.filter((user) => user.id !== selectedUserId)
      );
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

  return (
    <div className="adminGamesListMain">
      <Popup
        open={openPopup}
        onClose={handleClosePopup}
        position="right center"
      >
        <div className="popupContent">
          <img src={previewedImage} alt="" className="previewImage" />
        </div>
      </Popup>
      {isLoading && (
        <div className="loaderContainer">
          <div className="loader">
            <Oval
              visible={true}
              height="50"
              width="50"
              color="#ffffff"
              ariaLabel="oval-loading"
              // wrapperStyle={{}}
              // wrapperClass=""
            />
          </div>
        </div>
      )}
      <div className="setupPanel">
        <h3 className="trainingGamesHeader"> Live Games</h3>

        <div className="panelBtns">
          <div className="LiveAndArchiveBtns">
            <button
              className={`${window === "games-list" ? "openedWindow" : ""}`}
              onClick={() => handleChangeTab("games-list")}
            >
              Variation List
            </button>
            <button
              className={`${window === "ongoing-games" ? "openedWindow" : ""}`}
              onClick={() => handleChangeTab("ongoing-games")}
            >
              Ongoing
            </button>
            <button
              className={`${window === "archives" ? "openedWindow" : ""}`}
              onClick={() => handleChangeTab("archives")}
            >
              Completed
            </button>
          </div>
          <div className="basicDetailsHeaderBtns">
            {/* <button className="basicDetailsHeaderPreviewBtn">PREVIEW</button> */}
            {/* <button className="saveButton" onClick={handleSave}>
              SAVE
            </button> */}
            {/* <button
              className="saveButton cancel"
            //   onClick={handleCancelGameDetailsUpdates}
            >
              CANCEL
            </button> */}
            {/* <button className=""  >ARCHIVE</button> */}
          </div>
        </div>
      </div>
      <div className="listAndDetailsContainer">
        <div className="gamesListContainer">
          <div
            className={`listAndDetailsContainer ${
              previewedGame.id !== null ? "listAndDetailsContainerColumn" : ""
            }`}
          >
            <div className="trainerSetupListContainer">
              <div className="listTableTopDiv">
                <h2 className="">LIST</h2>
                <div className="searchAndFilterIcons">
                  {/* Search and filter icons */}
                </div>
              </div>
              <table>
                <thead>
                  <tr className="listTableHeader">
                    <th>Sno</th>
                    <th>Type</th>
                    <th>Variation Name</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody className="listTableBody">
                  {currentData?.map((game: GameOverview, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td>{game.gameType}</td>
                      <td>{game.variationName}</td>
                      <td className="viewColumn">
                        <img
                          style={{ cursor: "pointer" }}
                          className="openEye"
                          onClick={() => openGame(game)}
                          src={openeye}
                          alt="openeye"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="paginationControls">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="trainerSetupDetailsContainer">
              {openedGame.id === null ? (
                <div className="">No opened Game</div>
              ) : (
                <>
                  {previewedGame.id !== null ? (
                    <>
                      <div className="trainerSetupDetailsContainerCard">
                        <div className="trainerListTableTopDiv">
                          <h2 className="">DETAILS</h2>
                        </div>
                        <div className="trainerSetupDetailsContainerCardBody">
                          <div className="trainerGameDetailsRow">
                            <span className="trainerGameDetailFieldName">
                              Variation ID
                            </span>
                            <span className="trainerGameDetailFieldValue">
                              {openedGame.id}
                            </span>
                          </div>
                          <div className="trainerGameDetailsRow">
                            <span className="trainerGameDetailFieldName">
                              Game Type
                            </span>
                            <span className="trainerGameDetailFieldValue">
                              {openedGame.gameType}
                            </span>
                          </div>
                          <div className="trainerGameDetailsRow">
                            <span className="trainerGameDetailFieldName">
                              Variation Name
                            </span>
                            <span className="trainerGameDetailFieldValue">
                              {openedGame.variationName}
                            </span>
                          </div>
                          <div className={`DateNTimeContainer`}>
                            <div className="DateContainer">
                              <span className="dateHeading">
                                Date: {formatDate(currentDate)}
                              </span>
                            </div>
                            <div className="TimeContainer">
                              <span className="timeHeading">
                                Time: {formatTime(currentDate)}
                              </span>
                            </div>
                          </div>

                          <div className="qrContainer">
                            {/* {gameId !== null && (
                              <QRCode value={`${appUrl}/game-play/${gameId}`} />
                            )} */}
                          </div>
                          {/* <button
                      className={`trainerSetupDetailsContainerCardBtn `}
                      onClick={() => handlePreviewGame(openedGame)}
                    >
                      Preview Game
                    </button> */}
                          {/* <button
                            className={`trainerSetupDetailsContainerCardBtn`}
                            onClick={() => launchGame(previewedGame.id)}
                          >
                            Launch Game
                          </button> */}
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>

          <div
            className={`previewGameRightContainer ${
              previewedGame.id !== null ? "" : "hidden"
            }`}
          >
            <div className="boardContainer">
              <div className="boardContainerTop">
                <h2 className="">BOARD & CONTROLS</h2>
              </div>
              <div className="boardCard">
                <img src={previewImageSrc} alt="" className="boardImg" />
              </div>
              {/* <button
                className={`fullScreenBtn ${gameId === null ? "disabled" : ""}`}
                onClick={handleFullScreenSpectateGame}
              >
                OPEN GAME
              </button> */}
            </div>
          </div>
        </div>
        {showConfirmDelete && (
          <ConfirmDeleteDialog
            onClose={handleCloseConfirmDelete}
            onDelete={handleDeleteUser}
            Heading={"Are you sure want to delete variation ?"}
            ActionBtnText={"Delete"}
            cancelBtn={"Cancel"}
          />
        )}
      </div>
    </div>
  );
};

export default GamesList;
