import React, { useEffect } from 'react'
import logo from '../../../Assets/Images/pidlite-logo.png'
import ham from '../../../Assets/Images/ham.png'
import irm from '../../../Assets/Images/IRMLogo.png'
import openeye from '../../../Assets/Images/openeye.png'
import { redirect, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import { Audio, Oval } from 'react-loader-spinner'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import './Setup.css'

import QRCode from "react-qr-code";
import GamesList from './GamesList'
import OngoingGames from './OngoingGames'
import Archives from './Archives'


interface gameOverview {
    id: number | null | string,
    gameType: string,
    variationName: string,
    additionalDetails: {
        backgroundImage: string;
    };
}

function Setup() {

    const location = useLocation();

    const baseUri = process.env.REACT_APP_BASE_URL

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    const [openPopup, setOpenPopup] = React.useState(false);

    const [previewedImage, setPreviewedImage] = React.useState('');


    const [isLoading, setIsLoading] = React.useState(false)
    // const [test,setTest]=useState(false)

    const handleClosePopup = () => {
        setOpenPopup(false)
    }

    // console.log(location,"line57")
    const [window, setWindow] = React.useState(location.state ? location?.state : "games-list")

    // useState(location?.state ? location?.state : "games-list"
    //  discuss multiple launch games edge with omkar - " Woh screen dikhna band ho jayaga na... So yeah he can open a second tab and launch "

    return (
        <div className=''>
            <Popup open={openPopup} onClose={handleClosePopup} position="right center">
                <div className='popupContent'>
                    <img src={previewedImage} alt="" className="previewImage" />
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
            <div className='nav'>
                <div className="companyLogos">
                    <img src={irm} alt="" className="irm" />
                    <img src={logo} alt="" className='logo' />

                </div>
                <button className="logoutBtn" onClick={handleLogout}>Logout</button>
                <img src={ham} alt="" className='ham' />
            </div>
            <div className="setupPageContent">
                <div className="setupSideBar">
                    <a href="/training-games" className="setupSideBarItem">Training Games</a>
                    {/* <a href="/setup" className="setupSideBarItem">Setup</a> */}
                    <a href="/gameplay" className={`setupSideBarItem ${location.pathname === '/trainer-setup' ? 'activeSidebarLink' : ''}`}>Game Play</a>
                    <a href="/leaderboard" className="setupSideBarItem">Players & Leaderboard</a>
                </div>
                <div className="trainerSetupMain">
                    <h3 className="trainingGamesHeader">Training Games &gt; Setup</h3>

                    <div className="panelBtns">
                        <div className="LiveAndArchiveBtns">
                            <button className={`${window === 'games-list' ? 'openedWindow' : ''}`} onClick={() => setWindow('games-list')} style={{cursor:"pointer"}}>Games list</button>
                            <button className={`${window === 'ongoing-games' ? 'openedWindow' : ''}`} onClick={() => setWindow('ongoing-games')} style={{cursor:"pointer"}}>Ongoing Games</button>
                            <button className={`${window === 'archives' ? 'openedWindow' : ''}`} onClick={() => setWindow('archives')} style={{cursor:"pointer"}}>Archives</button>
                        </div>
                        <div className="basicDetailsHeaderBtns">
                            {/* <button className="basicDetailsHeaderPreviewBtn">PREVIEW</button> */}
                            <button
                                className=""
                            // onClick={handleSave}
                            >SAVE</button>
                            <button
                                className=""
                            // onClick={handleCancelGameDetailsUpdates}
                            >CANCEL</button>
                        </div>
                    </div>

                    <div className="previewGameMain">
                        {window === 'games-list' && (
                            <GamesList redirectOngoing={setWindow}/>
                        )}
                        {window === 'ongoing-games' && (
                            <OngoingGames />
                        )}
                        {window === 'archives' && (
                            <Archives />
                        )}
                       
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Setup