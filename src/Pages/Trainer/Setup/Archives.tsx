import React, { useEffect } from "react";
import "./Setup.css";
import { useLocation, useNavigate } from "react-router-dom";
import openeye from "../../../Assets/Images/openeye.png";

interface gameOverview {
  id: number | null | string;
  variationId: string;
  gameType: string;
  url: string;
  variationName: string;
  additionalDetails: {
    backgroundImage: string;
  };
}

const Archives = () => {
    const location = useLocation();
  //   const navigate = useNavigate();

  const baseUri = process.env.REACT_APP_BASE_URL;

  const [previewedGame, setPreviewedGame] = React.useState<gameOverview>({
    id: null,
    variationId: "",
    gameType: "",
    url: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  const [openedGame, setOpenedGame] = React.useState<gameOverview>({
    id: null,
    variationId: "",
    gameType: "",
    url: "",
    variationName: "",
    additionalDetails: {
      backgroundImage: "",
    },
  });

  const [gameListData, setGameListData] = React.useState([]);
  //   const [participantsList, setParticipantsList] = React.useState([]);
  const [rankingsList, setRankingsList] = React.useState([]);
  //   const [gameId, setGameId] = React.useState<number | null | string>(null);
  //   const [isLoading, setIsLoading] = React.useState(false);
  const [previewImageSrc, setPreviewImageSrc] = React.useState("");
  const [startedAt, setStartedAt] = React.useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 5;

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



console.log(location,"locationline69")

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const fetchGamesList = async () => {
    try {
      const archivedGamesResponse = await fetch(
        `${baseUri}/api/gameplay?status=4&status=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const archivedGamesListResdata = await archivedGamesResponse.json();
      console.log("gamelistResponse", archivedGamesListResdata);
      setGameListData(archivedGamesListResdata);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGamesList();
  }, []);

  function denseRank(data) {
    let rank = 1;
    let prevScore = null;
    let prevMoves = null;

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      const score = entry.score;
      const moves = entry.moves;

      if (score !== prevScore || moves !== prevMoves) {
        // Assign new rank when either score or moves change
        entry.rank = rank;
      } else {
        entry.rank = data[i - 1].rank;
      }

      // Update previous score and moves
      prevScore = score;
      prevMoves = moves;

      rank++;
    }
  }

  const openGame = (game: gameOverview) => {
    if (previewedGame.id !== null) {
      setPreviewedGame({
        id: null,
        variationId: "",
        gameType: "",
        url: "",
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
        let leaderboardArr = leaderBoardData.players.flat();
        denseRank(leaderboardArr);
        // const participants = leaderboardArr.map(player => ({
        //     id: player.id,
        //     rank: player.rank,
        //     name: player.name,
        //     score: player.score,
        //     numberOfMoves: player.numberOfMoves

        // }));
        // setParticipantsList(participants)
        setStartedAt(leaderBoardData.startedAt);

        const rankingsList = leaderBoardData.players.flat().map((player) => ({
          rank: player.rank,
          name: player.name,
          phoneNumber: player?.phoneNumber,
          score: player.score,
          numberOfMoves: player.numberOfMoves,
        }));
        setRankingsList(rankingsList);

        // console.log(rankingsList);
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
      url: game.url,
      variationName: game.variationName,
      additionalDetails: {
        backgroundImage: game.additionalDetails.backgroundImage,
      },
    });
  };

  const handlePreviewGame = async (game: gameOverview) => {
    const bgImageForUrl = game.additionalDetails.backgroundImage;

    const image = await fetch(`${baseUri}/download/${bgImageForUrl}`, {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    const imageBlob = await image.blob();
    setPreviewImageSrc(URL.createObjectURL(imageBlob));

    setPreviewedGame({
      id: game.id,
      variationId: game.variationId,
      gameType: game.gameType,
      url: game.url,
      variationName: game.variationName,
      additionalDetails: {
        backgroundImage: game.additionalDetails.backgroundImage,
      },
    });
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

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(Number(timestamp)); // Ensure the timestamp is a number
    return isNaN(date) ? "Invalid Date" : date.toLocaleString(); // Handle invalid date
  };

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
              {currentData.map((game: gameOverview, index) => (
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
                  <span className="trainerGameDetailFieldName">Game Type</span>
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
                  {startedAt && (
                    <div className="DateContainer">
                      <span className="dateHeading">
                        {" "}
                        {formatDate(startedAt)}
                      </span>
                    </div>
                  )}
                  <div className="TimeContainer">
                    <span className="timeHeading">Time: 13:24</span>
                  </div>
                </div>

                <div className="gameUrlFieldContainer">
                  <span>URL: </span>
                  <span>{openedGame.url}</span>
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
        <div className="boardContainer">
          <div className="boardContainerTop">
            <h2 className="">BOARD & CONTROLS</h2>
          </div>
          <div className="boardCard">
            <img src={previewImageSrc} alt="" className="boardImg" />
          </div>
        </div>
        <div className="participantsAndRankings">
          {/* <div className="participantsContainer">
                        <div className="listTableTopDiv">
                            <h2 className="">PARTICIPANTxS</h2>
                        </div>
                        <table>
                            <thead>
                                <tr className='listTableHeader'>
                                    <th>Sno</th>
                                    <th>RANK</th>
                                    <th>NAME</th>
                                    <th>SCORE</th>
                                    <th>MOVES</th>
                                </tr>
                            </thead>
                            <tbody className='listTableBody'>
                                {participantsList?.map((participant: any, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{participant.rank}</td>
                                        <td>{participant.name}</td>
                                        <td>{handleExtraScore(participant.score)}</td>
                                        <td>{participant.numberOfMoves}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> */}
          <div className="rankingsContainer">
            <div className="listTableTopDiv">
              <h2 className="">RANKINGS</h2>
            </div>
            <table>
              <thead>
                <tr className="listTableHeader">
                  <th>Sno</th>
                  <th>RANK</th>
                  <th>NAME</th>
                  <th>Phone Number</th>
                  <th>SCORE</th>
                  <th>MOVES</th>
                </tr>
              </thead>
              <tbody className="listTableBody">
                {rankingsList?.map((participant: any, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{participant.rank}</td>
                    <td>{participant.name}</td>
                    <td>{participant.phoneNumber}</td>
                    <td>{handleExtraScore(participant.score)}</td>
                    <td>{participant.numberOfMoves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archives;
