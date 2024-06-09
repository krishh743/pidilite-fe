import React, { useEffect, useMemo, useState } from 'react'
import './Game.css'
import logo from '../../Assets/Images/pidlite-logo.png'
import ham from '../../Assets/Images/ham.png'
import banner from '../../Assets/Images/game-banner.png'
import person from '../../Assets/Images/person.png'
import closeIcon from '../../Assets/Images/close.png'

import dong from '../../Assets/Audio/dong-sound.mp3'
import applause from '../../Assets/Audio/applause.mp3'

import { useNavigate, useParams } from 'react-router-dom'
import io, { Socket } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast'
import user from '../../Assets/Images/user.png'
import { Oval } from 'react-loader-spinner'

import Dice from 'react-dice-roll';
import Popup from 'reactjs-popup'
import MySVGComponent from '../../Assets/Images/UserSvg'

interface Player {
    id: number;
    name: string;
    color: string;
    previousPosition: number;
    currentPosition: number;
    score: number;
    status: number;
}

interface finishedPlayer {
    id: number;
    name: string;
    color: string;
    score: number;
    numberOfMoves: number;
    finishedTime: number;
    numberOfDevices: number;
}

interface GameCell {
    position: number;
    player?: Player;
}

const Game = () => {
    const navigate =useNavigate()
    const { id } = useParams();
    const baseUri = process.env.REACT_APP_BASE_URL

    const squaresToSkip = [3, 7, 13, 17, 22, 26, 29, 34, 39, 42, 46, 49, 52, 59]

    const [socketConnection, setSocketConnection] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

    const [isgameStarted, setIsGameStarted] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [board, setBoard] = useState('')

    const [diceTriggers, setDiceTriggers] = useState<string[]>([]);

    const [isDiceVisible, setIsDiceVisible] = useState(false)

    const [siteBanner, setSiteBanner] = useState('')

    const [openPopup, setOpenPopup] = React.useState(false);

    const [openLeaderboardPopup, setOpenLeaderboardPopup] = React.useState(false);

    const [previewedImage, setPreviewedImage] = React.useState('');

    const [previewLeaderboard, setPreviewLeaderboard] = React.useState<finishedPlayer[]>([])

    const [productImage, setProductImage] = useState('')

    const [trainerBackground, setTrainerBackground] = useState('')

    const [currentposition, setCurrentPosition] = useState(0)

    const [imageData, setImageData] = useState<any>({})


    const [gametype, setGameType] = useState('')
    const [variationName, setVariationName] = useState('')


    const [currentPlayerName, setCurrentPlayerName] = useState('')

    const [currentPlayerColor, setCurrentPlayerColor] = useState('')

    const [players, setPlayers] = useState<Player[]>([])

    const [diceValue, setDiceValue] = useState<1 | 2 | 3 | 4 | 5 | 6 | undefined>(undefined)

    const socketBaseUrl = process.env.REACT_APP_SOCKET_URL;

    const socket = io(`${socketBaseUrl}`, {
        query: {
            gameId: id,
            type: 'spectator'
        }
    });

    function playAudio(src: any) {
        let audio = new Audio(src);

        audio.addEventListener("canplaythrough", () => {
            audio.play().catch(e => {
                window.addEventListener('click', () => {
                    audio.play()
                })
            })
        });
    }

    console.log(previewLeaderboard,"previewLeaderboard")

    useEffect(() => {

        function onConnect() {
            console.log('connected')
            setSocketConnection(socket)
        }

        function onDisconnect() {
            console.log('disConnected')
            setSocketConnection(null)
        }

        function onImageDataEvent(data) {
            console.log('imageData', data)

            const newPlayers: Player[] = data.players.map((player: any) => {
                return {
                    id: player.id,
                    name: player.name,
                    color: player.colour,
                    score: player.score,
                    // previousPosition: number;
                    currentPosition: player.score,
                    status: player.status
                }
            })

            setGameType(data.images.gameType)
            setVariationName(data.images.variationName)
            setPlayers(newPlayers)
            setImageData(data)

            const fetchBg = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.backgroundImage}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    setBoard(imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchBg()

            const fetchSiteBanner = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.siteBanner}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    setSiteBanner(imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchSiteBanner()

            const fetchTrainerBackground = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.trainerBackgroundImage}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    setTrainerBackground(imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchTrainerBackground()

            const fetchProductImage = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.productImage}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    setProductImage(imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchProductImage()

            const fetchImg2 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img2}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img2, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg2()

            const fetchImg6 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img6}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img6, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg6()

            const fetchImg12 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img12}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img12, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg12()

            const fetchImg16 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img16}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img16, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg16()

            const fetchImg21 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img21}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img21, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg21()

            const fetchImg25 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img25}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img25, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg25()

            const fetchImg28 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img28}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img28, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg28()

            const fetchImg33 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img33}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img33, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg33()

            const fetchImg38 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img38}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img28, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg38()

            const fetchImg41 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img41}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img41, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg41()

            const fetchImg45 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img45}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img45, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg45()

            const fetchImg48 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img48}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img48, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg48()

            const fetchImg51 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img51}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img51, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg51()

            const fetchImg58 = async () => {
                try {
                    const image = await fetch(`${baseUri}/download/${data.images.additionalDetails.img58}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                    })

                    const imageBlob = await image.blob()
                    const imageSrc = URL.createObjectURL(imageBlob);

                    localStorage.setItem(data.images.additionalDetails.img58, imageSrc)
                } catch (error) {
                    console.log(error)

                }
            }
            fetchImg58()
        }

        function onYourTurnEvent(data) {
            // console.log('yourTurn', data)

        }

        function onMessageEvent(data) {
            // console.log("msgdata", data)
            toast(data)
        }

        function onErrorEvent(data) {
            console.log('socket error', data)
            toast(data)
        }

        function onNextPlayerEvent(data) {
            // setIsYourTurn(false)
            // console.log('nextPlayer msg', data)
            // console.log('data.user.color', data?.user?.colour)

            console.log("nextPlayerEvent score", data.user.score)
            console.log("nextPlayerEvent extrascore", handleExtraScore(data.user.score))

            setTimeout(() => {
                setCurrentPlayerName(data.name)
                setCurrentPosition(handleExtraScore(data.user.score))
                setCurrentPlayerColor(data.user.colour)
            }, 4000)
        }

        function onDrumRollEvent(data) {
            toast(`${data.message}`, {
                icon: '🥳🎉',
            });
        }

        function onPauseEvent(data) {
            console.log('pause msg', data)
        }

        function onGameOverEvent(data) {
            // console.log('gameOver', data)

            const transformedData: finishedPlayer[] = data.map((player: any) => ({
                id: player.id,
                name: player.name,
                color: player.colour,
                numberOfMoves: player.numberOfMoves,
                score: player.score,
                finishedTime: player.finishedTime,
                numberOfDevices: player.numberOfDevices
            }));

            setPreviewLeaderboard(transformedData);
            setOpenLeaderboardPopup(true)
        }

        function onNewUserEvent(data) {

            // console.log("new player event", data)
            const newPlayer: Player = {
                id: data.id,
                name: data.name,
                color: data.colour,
                previousPosition: 1,
                currentPosition: 1,
                score: data.score,
                status: data.status
            };

            setPlayers((prev: any) => [...prev, newPlayer])
            toast(data.message)
        }

        async function onDiceRollEvent(data) {
            console.log('search factoid here', data)

            setDiceValue(data.diceValue)
            setIsDiceVisible(true)

            setPlayers(prevPlayers => {
                return prevPlayers.map(prevPlayer => {
                    if (prevPlayer.id === data.player.id) {
                        return { ...prevPlayer, score: handleExtraScore(data.player.score) };
                    }
                    return prevPlayer;
                });
            });

            const factoidImgName = data.factoid // this is passed in for loop'd end
console.log(factoidImgName,"factoidImgName")
            setTimeout(() => {
                rollDice();
            }, 1000)


            // Delay (factoid + positions updation, diceValue update) by 3 seconds
            setTimeout(async () => {

                // console.log("players", players)

                const diceValue = data.diceValue
                const currentUpdatedPosition = data.player.score
                const playerPreviousPosition = data.player.previousScore

                let currentPositionDuringAnimation = playerPreviousPosition;

                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                const updatePositionWithDelay = async (position, speed) => {
                    console.log("position", position)
                    await delay(speed); // Wait for 1 second
                    setPlayers(prevPlayers => {
                        return prevPlayers.map(prevPlayer => {
                            if (prevPlayer.id === data.player.id) {
                                return { ...prevPlayer, currentPosition: position };
                            }
                            return prevPlayer;
                        });
                    });
                };

                for (let i = 1; i <= diceValue; i++) {
                    currentPositionDuringAnimation += 1;
                    if (squaresToSkip.includes(currentPositionDuringAnimation)) {
                        continue;
                    }
                    await updatePositionWithDelay(currentPositionDuringAnimation, 250);
                }

                const difference = currentUpdatedPosition - (playerPreviousPosition + diceValue);
                const direction = Math.sign(difference);
                const steps = Math.abs(difference);

                if (data.factoid !== null) { //if snake or ladder
                    if (direction < 0) { //snake
                        playAudio(dong)
                    } else {
                        playAudio(applause)
                    }
                }

                for (let i = 1; i <= steps; i++) {
                    currentPositionDuringAnimation += direction;
                    if (squaresToSkip.includes(currentPositionDuringAnimation)) {
                        continue;
                    }

                    await updatePositionWithDelay(currentPositionDuringAnimation, 100);

                    if (i === steps) {  // at last step show factoid
                        if (data.factoid !== null) {
                            console.log(data,"line663")
                            previewFactoid(factoidImgName)
                            console.log(" previewFactoid(factoidImgName)")
                        }
                    }
                }

                setDiceTriggers(['click']);
                setCurrentPosition(currentUpdatedPosition)

                // make dice disappear after latest position gets updated
                setTimeout(() => {
                    setIsDiceVisible(false);
                }, 1000);
                //

            }, 3000); // 3 seconds delay

            if (data.currentPosition === 64) {
                toast(`${data.message}`, {
                    icon: '🥳🎉',
                });
                // setIsUserWon(true)
                return;
            }

            toast(data.message)
        }


        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)
        socket.on('imageData', onImageDataEvent)
        socket.on('yourTurn', onYourTurnEvent)
        socket.on('message', onMessageEvent)
        socket.on('error', onErrorEvent)
        socket.on('nextPlayer', onNextPlayerEvent)
        socket.on('drumRoll', onDrumRollEvent)
        socket.on('pause', onPauseEvent)
        socket.on('gameOver', onGameOverEvent)
        socket.on('newUser', onNewUserEvent)
        socket.on('diceRolled', onDiceRollEvent)

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('imageData', onImageDataEvent);
            socket.off('yourTurn', onYourTurnEvent);
            socket.off('message', onMessageEvent)
            socket.off('error', onErrorEvent)
            socket.off('nextPlayer', onNextPlayerEvent)
            socket.off('drumRoll', onDrumRollEvent)
            socket.off('pause', onPauseEvent)
            socket.off('gameOver', onGameOverEvent)
            socket.off('newUser', onNewUserEvent)
            socket.off('diceRolled', onDiceRollEvent)
        };
    }, [])

    const handleExitFullScreen = () =>{
        console.log("handleExitFullScreen")
        navigate("/trainer-setup",{state:"ongoing-games"})
    }

    const handleStartBtn = () => {
        console.log('socketConnection', socketConnection)
        socketConnection?.emit('start')
    }

    const handlePauseBtn = () => {
        socketConnection?.emit('pause')
    }

    const handleEndBtn = () => {
        socketConnection?.emit('end')
    }

    // const imageUrlId = imageData?.images?.additionalDetails['img6']
    // console.log('imageUrlId', imageUrlId)

    // const previewFactoid = async (imageName: string) => {
    //     setIsLoading(true)
    //     console.log("imageUrl", imageName)

    //     try {
    //         // const image = await fetch(`${baseUri}/download/${imageUrl}`, {
    //         //     method: 'GET',
    //         //     headers: {
    //         //         'Authorization': `${localStorage.getItem('token')}`
    //         //     },
    //         // })
    //         // const imageBlob = await image.blob()

    //         const imageSrc = localStorage.getItem(imageName)
    //         console.log(imageSrc,"imageSrc")
    //         console.log(imageSrc !== null,"checkkkss")
    //         if (imageSrc !== null) {
    //             console.log("one")
    //             setOpenPopup(true);
    //             setPreviewedImage(imageSrc);
    //             setOpenPopup(false)
    //             // setIsLoading(false)
    //             console.log(":two")
    //         }

    //     } catch (error) {
    //         console.log(error)
    //         setOpenPopup(false)
    //         // setIsLoading(false)
    //     }
    //     finally{
    //         setIsLoading(false) 
    //     }
    // }



    const previewFactoid = async (imageName: string) => {
        setIsLoading(true);
        console.log("imageUrl", imageName);
    
        try {
            // Uncomment and update this section if you need to fetch the image from the server.
            // const image = await fetch(`${baseUri}/download/${imageUrl}`, {
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `${localStorage.getItem('token')}`
            //     },
            // });
            // const imageBlob = await image.blob();
    
            const imageSrc = localStorage.getItem(imageName);
            console.log(imageSrc !== null, "checkkkss");
            
            if (imageName !== null) {
                console.log("one");
                setPreviewedImage(imageSrc as string);
                setOpenPopup(true);
                console.log("Image ***** found in local storage");
            } else {
                console.log('Image not found in local storage');
            }
        } catch (error) {
            console.error('Error previewing factoid:', error);
            setOpenPopup(false);
        } finally {
            setIsLoading(false); // Ensure loading is stopped in both success and error cases
        }
    };
    


    useEffect(() => {
        if (socketConnection === null) return;

        return () => {
            socketConnection.disconnect()
        }


    }, [socketConnection])

    // console.log('players-outside', players)

    const handleClosePopup = () => {
        setOpenPopup(false)
    }

    const handleCloseLeaderboardPopup = () => {
        setOpenLeaderboardPopup(false)
    }

    // const memoizedValue: number[][] = useMemo(() => {
    //     const newArr: number[][] = [];
    //     let count = 1;
    //     for (let i = 0; i < 5; i++) {
    //         const row: number[] = [];
    //         if (i % 2 === 0) {
    //             for (let j = 0; j < 13; j++) {
    //                 row.unshift(count++);
    //             }
    //         } else {
    //             for (let j = 0; j < 13; j++) {
    //                 row.push(count++);
    //             }
    //         }
    //         newArr.push(row);
    //     }
    //     return newArr;
    // }, []);

    const memoizedValue: (number | Player)[][] = useMemo(() => {
        const newArr: (number | Player)[][] = [];
        let count = 1;
        for (let i = 0; i < 5; i++) {
            const row: (number | Player)[] = [];
            if (i % 2 === 0) {
                for (let j = 0; j < 13; j++) {
                    const position = count++;
                    const playerAtPosition = players.find(player => player.currentPosition === position);
                    row.unshift(playerAtPosition ? playerAtPosition : position);
                }
            } else {
                for (let j = 0; j < 13; j++) {
                    const position = count++;
                    const playerAtPosition = players.find(player => player.currentPosition === position);
                    row.push(playerAtPosition ? playerAtPosition : position);
                }
            }
            newArr.push(row);
        }
        return newArr;
    }, [players]);

    function handleExtraScore(newScore: number) {
        const biggerSquares = [2, 6, 12, 16, 21, 25, 28, 33, 38, 41, 45, 48, 51, 58]
        let extraSpace = 0;

        for (let el of biggerSquares) {
            if (el < newScore) {
                extraSpace += 1;
            } else if (el > newScore) {
                break;
            }
        }
        return newScore - extraSpace;
    };

    const rollDice = () => {
        const event = new KeyboardEvent('keypress', {
            key: 'Enter',  // Specify the trigger key
            bubbles: true,
            cancelable: true,
            view: window,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,

        });
        document.dispatchEvent(event);
    };


    return (
        <div className='gameMain'>
            <Popup open={openPopup} onClose={handleClosePopup} position="right center">
                <div className='popupContent'>
                    <img src={previewedImage} alt="" className="previewImage" />
                    <img className='popupCloseIcon' alt='popupformoves' onClick={handleClosePopup} src={closeIcon}></img>
                </div>
            </Popup>

            <Popup open={openLeaderboardPopup} onClose={handleCloseLeaderboardPopup} position="right center">
                <div className='leaderBoardPopupContent'>
                    {previewLeaderboard.map((player, index) => (
                        <div className="leaderboardPlayerCard" key={index}>
                            <div className="boardUserProfileSVGContainerForLeaderboard">
                                <MySVGComponent color={player.color} />
                            </div>
                            <p>Name: {player.name}</p>
                            <p>Score: {handleExtraScore(player.score)}</p>
                            <p>Moves: {player.numberOfMoves}</p>
                            <p>Number of Devices: {player.numberOfDevices}</p>
                        </div>
                    ))}
                </div>
            </Popup>

            {
                isLoading && (
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

                )
            }

            <Toaster
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        padding: '48px 64px',
                        fontSize: '48px',
                    },
                    success: {
                        duration: 3000,
                    },
                }}
            />
            <div className='nav'>
                <img src={logo} alt="" className='logo' />
                <span className="">{`${gametype === 'snl' ? 'Snakes & Ladders' : 'K'}: ${variationName}`}</span>
                <img src={ham} alt="" className='ham' />
            </div>
            <div className="gameBanner">
                <img src={siteBanner} alt="" />
            </div>
            <div className="trainerBackgroundContainer">
                <img src={trainerBackground} className='trainerBgrndImage'></img>
                <div className="gameBoardContainer">
                    <div className="playerCard">
                        <span className='playerHeader'>PLAYER</span>
                        <div className="playerCardInner">
                            {/* <div className="currentPlayerBoardSectionProfile" style={{ backgroundColor: currentPlayerColor }}>
                            <img src={person} alt="" className="userProfileBodyImg" />
                        </div> */}
                            <div className="profileSVGContainer">
                                <MySVGComponent color={currentPlayerColor} />
                            </div>
                            {currentPlayerName === '' ? (
                                <div className=""></div>
                            ) : (
                                <span className='currentPlayerName'>{`${currentPlayerName}`}</span>
                            )}

                            {/* <span className='currentPlayerName'>ANAS</span> */}
                        </div>
                        <div className="diceCardInnerContainer">
                            {!isDiceVisible && diceValue ? (
                                <div className=""></div>
                            ) : (
                                <Dice
                                    defaultValue={1}
                                    onRoll={(value) => console.log("dice value", value)}
                                    size={100}
                                    cheatValue={diceValue}
                                    triggers={['Enter']}
                                />
                                // <Dice
                                //     defaultValue={diceValue}
                                //     onRoll={(value) => console.log(value)}
                                //     size={100}
                                //     cheatValue={diceValue}
                                //     triggers={diceTriggers}
                                // />
                            )}
                        </div>
                    </div>
                    <div className="gameBoard">
                        {/* <table className='snlTable'>
                        <tbody>
                            {memoizedValue.reverse().map((row, rowIndex) => (
                                <tr key={`tr-${rowIndex}`}>
                                    {row.reverse().map((value, colIndex) => (
                                        <th key={`th-${value}`}>
                                            {
                                                (
                                                    <div className="snlTableBlock">
                                                        {value}
                                                        <img src={user} alt="" className="snlCoin" />
                                                    </div>
                                                )
                                            }
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table> */}
                        <table className='snlTable'>
                            <tbody>
                                {memoizedValue.reverse().map((row, rowIndex) => (
                                    <tr key={`tr-${rowIndex}`}>
                                        {row.reverse().map((value, colIndex) => (
                                            <th key={`th-${colIndex}`}>
                                                <div className="snlTableBlock">
                                                    {typeof value === 'number' ? value : (
                                                        // <div className="snlCoin" style={{ backgroundColor: (value as Player).color }}>
                                                        //     <img src={person} alt="" className="userProfileBodyImg" />
                                                        // </div>
                                                        <div className="boardUserProfileSVGContainer">
                                                            <MySVGComponent color={(value as Player).color} />
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <img src={board} alt="" className='gameBoardImg' />
                    </div>
                    <div className="diceCard">
                        <span>PRODUCT</span>
                        <div className="diceCardInner">
                            <img src={productImage} alt="" className="productImage" />
                        </div>
                    </div>
                </div>
                <div className="gameBoardbuttons">
                    <button className='exitBtn' onClick={handleExitFullScreen}>EXIT FULL SCREEN</button>
                    <div className="rightBtns">
                        <button className='startBtn' onClick={handleStartBtn}>START</button>
                        <button className='pauseBtn' onClick={handlePauseBtn}>PAUSE</button>
                        <button className='endBtn' onClick={handleEndBtn}>END</button>
                    </div>
                </div>

                <div className="playersLobby">
                    {players.length === 0 ? (
                        <div className=""></div>
                    ) : (
                        players.map((player: Player, index: number) => (
                            <div className="playerLobbyDiv" key={index}>
                                <div className="boardUserProfileSVGContainer">
                                    <MySVGComponent color={player.color} />
                                </div>
                                <p>Name: {player.name}</p>
                                <p>Score: {player.score}</p>
                            </div>
                        ))
                    )}

                    {/* <Dice
                    defaultValue={1}
                    onRoll={(value) => console.log("dice value", value)}
                    size={100}
                    cheatValue={4}
                    triggers={['Enter']}
                /> */}

                    {/* <button onClick={rollDice}>Roll Dice</button> */}

                </div>
            </div>

        </div >
    )
}

export default Game