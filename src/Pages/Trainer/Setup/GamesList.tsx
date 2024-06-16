import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import openeye from "../../../Assets/Images/openeye.png";
import "./Setup.css";
import OngoingGames from "./OngoingGames";

interface GameOverview {
  id: number | null | string;
  gameType: string;
  variationName: string;
  additionalDetails: {
    backgroundImage: string;
  };
}

const GamesList = ({ redirectOngoing }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const appUrl = process.env.REACT_APP_WEBSITE_URL;
  const baseUri = process.env.REACT_APP_BASE_URL;

  const [previewedGame, setPreviewedGame] = useState<GameOverview>({
    id: null,
    gameType: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  const [openedGame, setOpenedGame] = useState<GameOverview>({
    id: null,
    gameType: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  const [gameListData, setGameListData] = useState([]);
  const [participantsList, setParticipantsList] = useState([]);
  const [rankingsList, setRankingsList] = useState([]);
  const [gameId, setGameId] = useState<number | null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // const [window, setWindow] = React.useState('gongoing-games')

  useEffect(() => {
    const fetchGamesList = async () => {
      setIsLoading(true);
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
        setGameListData(gamesListResdata);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(true);
      }
    };

    fetchGamesList();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  const openGame = async (game: GameOverview) => {
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

    const fetchLeaderBoardData = async () => {
      try {
        const leaderBoardResponse = await fetch(
          `${baseUri}/api/gameplay/${game.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const leaderBoardData = await leaderBoardResponse.json();
        const participants = leaderBoardData.players.flat().map((player) => ({
          id: player.id,
          name: player.name,
        }));
        setParticipantsList(participants);

        const rankingsList = leaderBoardData.players.flat().map((player) => ({
          name: player.name,
          score: player.score,
          finishedTime: new Date(player.finishedTime).toLocaleString(),
        }));
        setRankingsList(rankingsList);
        return leaderBoardData;
      } catch (error) {
        console.log("error", error);
        return [];
      }
    };

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

  const totalPages = Math.ceil(gameListData.length / rowsPerPage);
  const currentData = gameListData.slice(
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


  return (
    <>
      {!isLoading ? (
        <>
          {" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "90vh",
              width: "100%",
              fontSize: "20px",
            }}
          >
            Loading..
          </div>
        </>
      ) : (
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
                            {gameId !== null && (
                              <QRCode value={`${appUrl}/game-play/${gameId}`} />
                            )}
                          </div>
                          {/* <button
                      className={`trainerSetupDetailsContainerCardBtn `}
                      onClick={() => handlePreviewGame(openedGame)}
                    >
                      Preview Game
                    </button> */}
                          <button
                            className={`trainerSetupDetailsContainerCardBtn`}
                            onClick={() => launchGame(previewedGame.id)}
                          >
                            Launch Game
                          </button>
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
      )}
    </>
  );
};

export default GamesList;
