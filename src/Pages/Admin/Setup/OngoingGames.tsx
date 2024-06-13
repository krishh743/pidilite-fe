import React, { useEffect } from "react";
import "./Setup.css";
import { useLocation, useNavigate } from "react-router-dom";
import openeye from "../../../Assets/Images/openeye.png";
import QRCode from "react-qr-code";

interface gameOverview {
  id: number | null | string;
  variationId: string;
  gameType: string;
  variationName: string;
  additionalDetails: {
    backgroundImage: string;
  };
}

const OngoingGames = ({ setWindow, window }) => {
  const handleChangeTab = (tab) => {
    setWindow(tab);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const baseUri = process.env.REACT_APP_BASE_URL;

  const [previewedGame, setPreviewedGame] = React.useState<gameOverview>({
    id: null,
    variationId: "",
    gameType: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  const [openedGame, setOpenedGame] = React.useState<gameOverview>({
    id: null,
    variationId: "",
    gameType: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  const [gameListData, setGameListData] = React.useState([]);
  const [participantsList, setParticipantsList] = React.useState([]);
  const [rankingsList, setRankingsList] = React.useState([]);
  const [gameId, setGameId] = React.useState<number | null | string>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewImageSrc, setPreviewImageSrc] = React.useState("");

  const appUrl = process.env.REACT_APP_WEBSITE_URL;

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

  const openGame = (game: gameOverview) => {
    if (previewedGame.id !== null) {
      setPreviewedGame({
        id: null,
        variationId: "",
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
        console.log("lleaderBoardData", leaderBoardData);
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

        console.log(rankingsList);
        return leaderBoardData;
      } catch (error) {
        console.log("error", error);
        return [];
      }
    };

    fetchLeaderBoardData();

    const fetchBgrndImage = async () => {
      // try {
      //     const bgResponse = await fetch(`${baseUri}/api/gameplay/${game.id}`, {
      //         method: 'GET',
      //         headers: {
      //             'Content-Type': 'application/json',
      //             'Authorization': `${localStorage.getItem('token')}`
      //         },
      //     })
      //     const leaderBoardData = await leaderBoardResponse.json()
      //     console.log("lleaderBoardData", leaderBoardData)
      //     const participants = leaderBoardData.players.flat().map(player => ({
      //         id: player.id,
      //         name: player.name,
      //     }));
      //     setParticipantsList(participants)
      //     const rankingsList = leaderBoardData.players.flat().map(player => ({
      //         name: player.name,
      //         score: player.score,
      //         finishedTime: new Date(player.finishedTime).toLocaleString()
      //     }));
      //     setRankingsList(rankingsList)
      //     console.log(rankingsList);
      //     return leaderBoardData
      // } catch (error) {
      //     console.log("error", error)
      //     return []
      // }
    };

    // setGameListData(gamesListResdata)
    setOpenedGame({
      id: game.id,
      variationId: game.variationId,
      gameType: game.gameType,
      variationName: game.variationName,
      additionalDetails: {
        backgroundImage: game.additionalDetails.backgroundImage,
      },
    });
  };

  const handlePreviewGame = async (game: gameOverview) => {
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
      variationId: game.variationId,
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
    console.log("gameId", gameId);
    navigate(`/game-spectate/${gameId}`);
  };

  return (
    <div className="adminGamesListContainer">
      <div className="adminGamesListSetupPanel">
        <h3 className="trainingGamesHeader">Training Games &gt; Setup</h3>

        <div className="panelBtns">
          <div className="LiveAndArchiveBtns">
            <button
              className={`${window === "games-list" ? "openedWindow" : ""}`}
              onClick={() => handleChangeTab("games-list")}
            >
              Games List
            </button>
            <button
              className={`${window === "ongoing-games" ? "openedWindow" : ""}`}
              onClick={() => handleChangeTab("ongoing-games")}
            >
              Ongoing Games
            </button>
            <button
              className={`${window === "archives" ? "openedWindow" : ""}`}
              onClick={() => handleChangeTab("archives")}
            >
              Archives
            </button>
          </div>
          <div className="basicDetailsHeaderBtns">
            <button className="basicDetailsHeaderPreviewBtn">PREVIEW</button>
            <button className="">SAVE</button>
            <button className="">CANCEL</button>
            <button className="">ARCHIVE</button>
          </div>
        </div>
      </div>

      <div className="adminOngoingGamesBody">
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
                {gameListData?.map((game: gameOverview, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{game.gameType}</td>
                    <td>{game.variationName}</td>
                    <td>{game?.name}</td>
                    <td>{game.id}</td>
                    <td className="viewColumn">
                      <img
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
          </div>
          <div className="trainerSetupDetailsContainer">
            {openedGame.id === null ? (
              <div className="">No opened Game</div>
            ) : (
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
                  <div
                    className={`DateNTimeContainer ${
                      openedGame.id === previewedGame.id ? "" : "hidden"
                    }`}
                  >
                    <div className="DateContainer">
                      <span className="dateHeading">Date: 12-Mar-2024</span>
                    </div>
                    <div className="TimeContainer">
                      <span className="timeHeading">Time: 13:24</span>
                    </div>
                  </div>

                  <div className="qrContainer">
                    {gameId !== null && (
                      <QRCode value={`${appUrl}/game-play/${gameId}`} />
                    )}
                  </div>
                  <button
                    className={`trainerSetupDetailsContainerCardBtn ${
                      previewedGame.id === openedGame.id ? "hidden" : ""
                    }`}
                    onClick={() => handlePreviewGame(openedGame)}
                  >
                    Preview Game
                  </button>
                  {/* <button className='trainerSetupDetailsContainerCardBtn' onClick={() => launchGame(previewedGame.id)}>Launch Game</button> */}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`previewGameRightContainer ${
            previewedGame.id !== null ? "" : "hidden"
          }`}
        >
          {/* <div className="participantsAndRankings">
                    <div className="participantsContainer">
                        <div className="listTableTopDiv">
                            <h2 className="">PARTICIPANTS</h2>
                        </div>
                        <table>
                            <thead>
                                <tr className='listTableHeader'>
                                    <th>Sno</th>
                                    <th>NAME</th>
                                </tr>
                            </thead>
                            <tbody className='listTableBody'>
                                {participantsList?.map((participant: any, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{participant.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="rankingsContainer">
                        <div className="listTableTopDiv">
                            <h2 className="">RANKINGS</h2>
                        </div>
                        <table>
                            <thead>
                                <tr className='listTableHeader'>
                                    <th>Sno</th>
                                    <th>NAME</th>
                                    <th>RANK</th>
                                    <th>SPEED</th>
                                </tr>
                            </thead>
                            <tbody className='listTableBody'>
                                {rankingsList?.map((participant: any, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{participant.name}</td>
                                        <td>{participant.score}</td>
                                        <td>{participant.finishedTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> */}
          <div className="boardContainer">
            <div className="boardContainerTop">
              <h2 className="">BOARD & CONTROLS</h2>
            </div>
            <div className="boardCard">
              <img src={previewImageSrc} alt="" className="boardImg" />
            </div>
            <button
              className={`fullScreenBtn ${gameId === null ? "disabled" : ""}`}
              onClick={handleFullScreenSpectateGame}
            >
              OPEN GAME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingGames;
