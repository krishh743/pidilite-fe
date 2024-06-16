import React, { useEffect, useState } from 'react'
import './UserMobileGameLogin.css'
import pidlite from '../../Assets/Images/pidlite-logo.png'
import rk from '../../Assets/Images/rk.png'
import dr from '../../Assets/Images/dr-fixit.png'
import mobileLoginbg from '../../Assets/Images/mobileLoginbg.png'
import user from '../../Assets/Images/user.png'
import winner from '../../Assets/Images/winner.jpg'

import mobileBannerHardcoded from '../../Assets/Images/mobile-banner.png'

import { useParams } from 'react-router-dom'
import io, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter'
import toast, { Toaster } from 'react-hot-toast'

import Dice from 'react-dice-roll';
import MySVGComponent from '../../Assets/Images/UserSvg'

const UserMobileGameLogin = () => {

    const { id } = useParams();

    const baseUri = process.env.REACT_APP_BASE_URL
    const socketUri = process.env.REACT_APP_SOCKET_URL

    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')

    const [socketConnection, setSocketConnection] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

    const [isgameStarted, setIsGameStarted] = useState(false)

    const [mobileBanner, setMobileBanner] = useState('')

    const [diceValue, setDiceValue] = useState<1 | 2 | 3 | 4 | 5 | 6 | undefined>(undefined)
    const [isYourTurn, setIsYourTurn] = useState(false)

    const [isDiceVisible, setIsDiceVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false)

    const [diceTriggers, setDiceTriggers] = useState<string[]>([]);

    const [currentPosition, setCurrentPosition] = useState(1)

    const [isUserWon, setIsUserWon] = useState(false)

    const [userColor, setUserColor] = useState('');

    const [gameType, setGameType] = useState('')

    const [playerBackground, setPlayerBackground] = useState('')

    const [varationName, setVariationName] = useState('')

    useEffect(() => {
        const fetchInitalDetails = async () => {
            const response = await fetch(`${baseUri}/api/gameplay/url/${id}`,
            {
                method: "GET",
                headers: {
                  'ngrok-skip-browser-warning':'true'
                },
              }
            );
            const data = await response.json();
            console.log('inital fetch data:', data)
            // setMobileBanner(data.mobileBanner)

            setGameType(data.gameType)
            setVariationName(data.variationName)

            const fetchMobileBannerUrl = async () => {
                const response = await fetch(`${baseUri}/download/${data.mobileBanner}`,{
                    method: "GET",
                    headers: {
                      'ngrok-skip-browser-warning':'true'
                    },
                  });

                const imageBlob = await response.blob()
                const imageSrc = URL.createObjectURL(imageBlob);
                setMobileBanner(imageSrc)
            }
            fetchMobileBannerUrl();

            const fetchplayerBgrndUrl = async () => {
                const response = await fetch(`${baseUri}/download/${data?.additionalDetails?.playerBackgroundImage}`,{
                    method: "GET",
                    headers: {
                      'ngrok-skip-browser-warning':'true'
                    },
                  });

                const imageBlob = await response.blob()
                const imageSrc = URL.createObjectURL(imageBlob);
                setPlayerBackground(imageSrc)
            }
            fetchplayerBgrndUrl();

        }
        fetchInitalDetails();
    }, [])

    const handleLogin = async () => {
        try {
            if (name === '' || phone === '') {
                alert('Please fill all the fields')
                return;
            } else {
                const newSocket = io(`${socketUri}`, {
                    extraHeaders:{
                        'ngrok-skip-browser-warning':'true'
                    },
                    query: {
                        playerName: name,
                        gameId: id,
                        playerPhone: phone,
                        type: 'player'
                    }
                });

                // Log the socket connection
                console.log('Socket:', newSocket);

                // Event listeners to handle socket events
                newSocket.on('connect', () => {
                    console.log('Socket connected');
                    setSocketConnection(newSocket)
                    setIsGameStarted(true)
                });

                newSocket.on('imageData', (data) => {
                    console.log('imageData data', data)
                    const colour = data.user.colour
                    setUserColor(colour);
                })

                newSocket.on('disconnect', () => {
                    console.log('Socket disconnected');
                    toast("Connection Lost, attempting to reconnect...")
                });

            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // const fetchMobileBanner = async () => {
        //     try {
        //         const image = await fetch(`${baseUri}/api/gameplay?url=${id}`, {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `${localStorage.getItem('token')}`
        //             },
        //         })
        //         console.log("image---------", image)
        //         const imageBlob = await image.blob()
        //         const imageSrc = URL.createObjectURL(imageBlob);

        //         setMobileBanner(imageSrc)
        //     } catch (error) {
        //         console.log(error)

        //     }
        // }
        // fetchMobileBanner()
    }, [])


    useEffect(() => {
        console.log('socketConnection ------>', socketConnection)
        if (socketConnection === null) return;
        socketConnection.on('imageData', (data) => {
            console.log('imageData data', data)

            const colour = data.user.colour
            setUserColor(colour);

            // const fetchImages = async () => {
            //     try {
            //         const image = await fetch(`${baseUri}/download/${data.images.mobileBanner}`, {
            //             method: 'GET',
            //             headers: {
            //                 'Authorization': `${localStorage.getItem('token')}`
            //             },
            //         })

            //         const imageBlob = await image.blob()
            //         const imageSrc = URL.createObjectURL(imageBlob);

            //         setMobileBanner(imageSrc)
            //     } catch (error) {
            //         console.log(error)

            //     }
            // }

            // fetchImages()
        })


        socketConnection.on('yourTurn', (data) => {
            console.log('yourTurn', data)

        })

        socketConnection.on('onclose', (data) => {
            console.log('yourTurn', data)
            alert('close...')

        })

        socketConnection.on('gameOver', (data) => {
            console.log('gameOver', data)
        })

        socketConnection.on('message', (data) => {
            console.log("msgdata", data)
            if(data === "Game started."){
                setIsPaused(false)
            }
            toast(data)
        })

        socketConnection.on('error', (data) => {
            console.log('socket error', data)
            toast("Connect")

        })

        // socketConnection.on('yourTurn', (data) => {
        //     console.log('yourTurn msg', data)
        // })

        socketConnection.on('nextPlayer', (data) => {
            setIsYourTurn(false)
            console.log('nextPlayer msg', data)
            if (data.self) {

                setTimeout(() => {
                    setDiceValue(undefined)
                    setIsYourTurn(true)
                }, 5000)

            } else {
                setIsYourTurn(false)

                setTimeout(() => {
                    setIsDiceVisible(false)
                    setDiceValue(undefined)
                }, 6000)
            }
        })

        socketConnection.on('drumRoll', (data) => {
            // toast('Congratulations! You won the Game', {
            //     icon: '🥳🎉',
            // });
        })

        socketConnection.on('pause', (data) => {
            console.log('pause msg', data)
            setIsPaused(true)
        })

        socketConnection.on('start', (data) => {
            console.log('satrt pause msg', data)
            setIsPaused(false)
        })

        socketConnection.on('diceRolled', (data) => {
            console.log('recieved dice value', data.diceValue)

            if (data.self) {
                setDiceValue(data.diceValue)
                setIsDiceVisible(true)

                setTimeout(() => {
                    rollDice();
                }, 1000)

                setTimeout(() => {
                    setIsDiceVisible(false);
                }, 3000);


                if (data.player.score === 64) {
                    // toast(`${data.message}`, { 
                    //     icon: '🥳🎉',
                    // });
                    setIsUserWon(true)
                    return;
                }
                setTimeout(() => {
                setCurrentPosition(data.player.score)


                    toast(data.message)
                }, 2000)
            } else {

                setTimeout(() => {
                    toast(data.message)
                }, 2000)
            }
            console.log('resume msg', data)
        })

        return () => {
            if (socketConnection) {
                socketConnection.disconnect();
            }
        };

    }, [socketConnection])

    const handleRollDice = () => {
        console.log('Dice Rolled')

        socketConnection?.emit('rollDice')
    }

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

    return (
        <div className='mobileScreen'>
            <Toaster
                position="bottom-center"
                // toastOptions={{
                //     style: {
                //         zIndex: 0,
                //     },
                // }}
                />
            <div className="mobileLoginNav">
                <img src={pidlite} alt="" className="pidlite" />
                <div className="rkCircle">
                    <img src={rk} alt="" className="rk" />
                </div>

            </div>
            <div className="mobileLoginBody">
                <span className="snlHeading">{`${gameType} : ${varationName}`}</span>
                {/* <img src={mobileBanner} alt="" className="mobileLoginBodyUpperBanner" /> */}
                <img src={mobileBanner} alt="" className="mobileLoginBodyUpperBanner" />
                {/*<img src={mobileBannerHardcoded} alt="" className="mobileLoginBodyUpperBanner" /> */}
                {/* <img src={mobileLoginbg} alt="" className="mobileLoginBodyBg" /> */}
                <img src={playerBackground} alt="" className="mobileLoginBodyBg" />

                <div className="tenor-gif-embed" data-postid="23448011" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/youre-a-winner-winner-trophy-you-won-first-place-gif-23448011">Youre A Winner Winner GIF</a>from <a href="https://tenor.com/search/youre+a+winner-gifs">Youre A Winner GIFs</a></div>


                {isgameStarted ? (
                    <div className="diceCardDetails">
                        {
                            isUserWon ? (
                                <div className="">
                                    <img src={winner} alt="" className="winner" />
                                </div>
                            ) : (<div className="diceRollCard">
                                <div className="diceContainer">
                                    {!isDiceVisible && diceValue ? (
                                        <div className=""></div>
                                    ) : (
                                        <Dice
                                            defaultValue={1}
                                            onRoll={(value) => console.log(value)}
                                            size={100}
                                            cheatValue={diceValue}
                                            triggers={['Enter']}
                                        />
                                    )}
                                </div>

                            </div>)
                        }

                        <button disabled={isPaused} className={`${isYourTurn && !isPaused ? 'enterBtn' : 'disabledBtn'}`} onClick={handleRollDice}>
                            {isYourTurn ? 'ROLL DICE' : 'NOT YOUR TURN'}
                        </button>
                        <div className="boardUserProfileSVGContainer">
                            <MySVGComponent color={userColor} />
                        </div>
                        <span className="currentLocationTitle">Your Current Location</span>
                        <div className="currentLocationBoard">{`${handleExtraScore(currentPosition)}/50`}</div>
                        {/* <div className="moveUpdatesStrip"></div> */}
                    </div>
                ) : (
                    <div className="mobileLoginDetails">
                        <div className='mobileLoginCard'>

                            <div className="inputDiv">
                                <span className="nameInput">
                                    Name
                                </span>
                                <input
                                    type="text"
                                    className=""
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="inputDiv">
                                <span className="">
                                    Mobile
                                </span>
                                <input type="number" className=""
                                    onChange={(e) => setPhone(e.target.value)}
                                />

                            </div>
                        </div>
                        <button className="enterBtn" onClick={handleLogin}>
                            ENTER
                        </button>

                    </div>
                )}
            </div >
        </div >

    )
}

export default UserMobileGameLogin