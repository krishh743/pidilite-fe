import React, { useEffect, useState } from "react";
import "./Setup.css";
import { useLocation, useNavigate } from "react-router-dom";
import openeye from "../../../Assets/Images/openeye.png";
import QRCode from "react-qr-code";

interface gameOverview {
  id: number | null | string;
  variationId: string;
  url: string;
  startedAt?: string;
  gameType: string;
  variationName: string;
  additionalDetails: {
    backgroundImage: string;
  };
}

const OngoingGames = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const appUrl = process.env.REACT_APP_WEBSITE_URL;
  const baseUri = process.env.REACT_APP_BASE_URL;

  const [previewedGame, setPreviewedGame] = useState<gameOverview>({
    id: null,
    variationId: "",
    gameType: "",
    url: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  const [openedGame, setOpenedGame] = useState<gameOverview>({
    id: null,
    variationId: "",
    gameType: "",
    url: "",
    startedAt: "",
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [gameValue, setGameValue] = useState();
  const rowsPerPage = 5;

  const fetchGamesList = async () => {
    try {
      const ongoingGamesResponse = await fetch(
        `${baseUri}/api/gameplay?status=1&status=2&status=3`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const ongoingGamesListResdata = await ongoingGamesResponse.json();
      console.log("gamelistResponse", ongoingGamesListResdata);
      setGameListData(ongoingGamesListResdata);
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

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (gameListData.length > 0) {
      openGame(gameListData[gameListData.length - 1]);
    }
  }, [gameListData]);

  useEffect(() => {
    let timeIntervle
    if (gameValue) {
    timeIntervle =   setInterval(() => {
        fetchLeaderBoardData(gameValue);
      }, 5000);
    }
return ()=>{clearInterval(timeIntervle)}
  }, [gameValue]);

  const fetchLeaderBoardData = async (game) => {
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
      console.log("leaderBoardData", leaderBoardData);
      const participants = leaderBoardData.players.flat().map((player) => ({
        id: player.id,
        name: player.name,
        phoneNumber:player?.phoneNumber,
        numberOfMoves: player.numberOfMoves,
        score: player.score,
      }));

      setParticipantsList(participants);

      // const rankingsList = leaderBoardData.players.flat().map((player) => ({
      //   name: player.name,
      //   score: player.score,
      //   finishedTime: new Date(player.finishedTime).toLocaleString(),
      // }));
      // setRankingsList(rankingsList);

      console.log(rankingsList);
      return leaderBoardData;
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };

  const openGame = async (game: gameOverview) => {
    setGameValue(game);
    if (previewedGame?.id !== null) {
      setPreviewedGame({
        id: null,
        variationId: "",
        gameType: "",
        url: "",
        startedAt: "",
        variationName: "",
        additionalDetails: {
          backgroundImage: "",
        },
      });
    }

    console.log(participantsList, "line119");

    await fetchLeaderBoardData(game);

    console.log(game, "game");

    const bgImageParsedValue = game?.additionalDetails?.backgroundImage;

    setOpenedGame({
      id: game?.id,
      variationId: game?.variationId,
      url: game?.url,
      startedAt: game?.startedAt,
      gameType: game?.gameType,
      variationName: game?.variationName,
      additionalDetails: {
        backgroundImage: bgImageParsedValue,
      },
    });

    // console.log(game?.additionalDetails?.backgroundImage,game?.additionalDetails,game,"line169")

    setPreviewedGame({
      id: game?.id,
      variationId: game?.variationId,
      url: game?.url,
      startedAt: game?.startedAt,
      gameType: game?.gameType,
      variationName: game?.variationName,
      additionalDetails: {
        backgroundImage: game?.additionalDetails?.backgroundImage,
      },
    });

    const image = await fetch(`${baseUri}/download/${bgImageParsedValue}`, {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    const imageBlob = await image.blob();
    setPreviewImageSrc(URL.createObjectURL(imageBlob));

    // console.log(
    //   imageBlob,
    //   URL.createObjectURL(imageBlob),
    //   previewImageSrc,
    //   "imageBlob"
    // );
  };

  console.log(gameListData, "gameListData");

  const handleFullScreenSpectateGame = () => {
    navigate(`/game-spectate/${openedGame.url}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(gameListData.length / rowsPerPage);
  const currentData = gameListData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  console.log(currentData, "currentData");
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  function handleExtraScore(newScore: number) {
    const biggerSquares = [
      2, 6, 12, 16, 21, 25, 28, 33, 38, 41, 45, 48, 51, 58,
    ];
    let extraSpace = 0;

    for (let el of biggerSquares) {
      if (el < newScore) {
        extraSpace += 1;
      } else if (el > newScore) {
        break;
      }
    }
    return newScore - extraSpace;
  }

  return (
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
              {/* <img src={searchIcon} alt="" className='searchIcon' />
                            <img src={filterIcon} alt="" className='filterIcon' /> */}
            </div>
          </div>
          <table>
            <thead>
              <tr className="listTableHeader">
                <th>Sno</th>
                <th>Type</th>
                <th>Name</th>
                <th>Trainer Name</th>
                <th>GamePlay ID</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody className="listTableBody">
              {currentData?.map((game: gameOverview, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td>{game?.gameType}</td>
                  <td>{game?.variationName}</td>
                  <td>{game?.name}</td>
                  <td>{game?.id}</td>
                  <td className="viewColumn">
                    <img
                      style={{ cursor: "pointer" }}
                      className="openEye"
                      onClick={() => openGame(game)}
                      src={openeye}
                      alt="openeye"
                    ></img>
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
          {openedGame?.id === null ? (
            <div className="">No opened Game</div>
          ) : (
            <>
              {previewedGame.id !== null ? (
                <>
                  {" "}
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
                          {openedGame?.id}
                        </span>
                      </div>
                      <div className="trainerGameDetailsRow">
                        <span className="trainerGameDetailFieldName">
                          Game Type
                        </span>
                        <span className="trainerGameDetailFieldValue">
                          {openedGame?.gameType}
                        </span>
                      </div>
                      <div className="trainerGameDetailsRow">
                        <span className="trainerGameDetailFieldName">
                          Variation Name
                        </span>
                        <span className="trainerGameDetailFieldValue">
                          {openedGame?.variationName}
                        </span>
                      </div>
                      <div
                        className={`DateNTimeContainer ${
                          openedGame?.id === previewedGame?.id ? "" : "hidden"
                        }`}
                      >
                        <div className="DateContainer">
                          <span className="dateHeading">
                            {" "}
                            Date: {formatDate(currentDate)}
                          </span>
                        </div>
                        <div className="TimeContainer">
                          <span className="timeHeading">
                            {openedGame?.startedAt === null
                              ? "-"
                              : `${openedGame?.startedAt}`}
                          </span>
                        </div>
                      </div>

                      <div className="qrContainer">
                        {previewedGame?.id !== null && (
                          <QRCode
                            value={`${appUrl}/game-play/${previewedGame?.url}`}
                          />
                        )}
                      </div>
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
            <button
              className={`fullScreenBtn`}
              onClick={handleFullScreenSpectateGame}
            >
              FULL SCREEN
            </button>
          </div>
          <div className="participantsAndRankings">
            <div className="participantsContainer">
              <div className="listTableTopDiv">
                <h2 className="">PARTICIPANTS</h2>
              </div>
              <table>
                <thead>
                  <tr className="listTableHeader">
                    <th>Sno</th>
                    <th>Rank</th>
                    <th>NAME</th>
                    <th>Phone Number</th>
                    <th>Score</th>
                    <th>Moves</th>
                  </tr>
                </thead>
                <tbody className="listTableBody">
                  {participantsList?.map((participant: any, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{index + 1}</td>
                      <td>{participant.name}</td>
                      <td>{participant?.phoneNumber}</td>
                      <td>{participant?.score}</td>
                      <td>{participant?.numberOfMoves}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="rankingsContainer">
              <div className="listTableTopDiv">
                <h2 className="">RANKINGS</h2>
              </div>
              <table>
                <thead style={{ textAlign: "center" }}>
                  <tr
                    className="listTableHeader"
                    style={{ textAlign: "center" }}
                  >
                    <th>RANK</th>
                    <th>NAME</th>
                    <th>SCORE</th>
                    <th>MOVES</th>
                  </tr>
                </thead>
                <tbody className="listTableBody">
                  {rankingsList?.map((participant: any, index) => (
                    <tr key={index}  style={{ textAlign: "center" }}>
                      <td>{index + 1}</td>
                      <td>{participant.name}</td>
                      <td>{handleExtraScore(participant.score)}</td>
                      <td>{participant.numberOfMoves || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
          </div>
          {/* <div className="boardContainer">
                    <div className="boardContainerTop">
                        <h2 className="">BOARD & CONTROLS</h2>
                    </div>
                    <div className="boardCard">
                        <img src={previewImageSrc} alt="" className="boardImg" />
                    </div>
                </div> */}
        </div>
      </div>
    </div>
  );
};

export default OngoingGames;
