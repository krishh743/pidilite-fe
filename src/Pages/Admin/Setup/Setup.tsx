import React, { useEffect } from 'react'
import logo from '../../../Assets/Images/pidlite-logo.png'
import ham from '../../../Assets/Images/ham.png'
import irm from '../../../Assets/Images/IRMLogo.png'
import openeye from '../../../Assets/Images/openeye.png'


import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css'

import { Audio, Oval } from 'react-loader-spinner'

import './Setup.css'
import { useLocation, useNavigate } from 'react-router-dom'
import GamesList from './GamesList'
import OngoingGames from './OngoingGames'
import Archives from './Archives'

interface gameOverview {
  id: number | null | string,
  gameType: string,
  variationName: string,
  mobileBanner: string,
  siteBanner: string,
  isNewGame: boolean,
  productImage: string,
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

const Setup = () => {

  const location = useLocation();

  const [window, setWindow] = React.useState('games-list')
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className='setupMain'>
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

          {/* <a href="/add-users" className="setupSideBarItem">Add Users</a> */}
          <a href="/admin-add-user" className={`setupSideBarItem ${location.pathname === '/admin-add-user' ? 'activeSidebarLink' : ''}`}>Add Users</a>
          <a href="/training-games" className="setupSideBarItem">Training Games</a>
          <a href="/setup" className={`setupSideBarItem ${location.pathname === '/admin-setup' ? 'activeSidebarLink' : ''}`}>Setup</a>
          <a href="/gameplay" className="setupSideBarItem">Game Play</a>
          <a href="/leaderboard" className="setupSideBarItem">Players & Leaderboard</a>
        </div>


        <div className="previewGameMain">
          {window === 'games-list' && (
            <GamesList setWindow={setWindow} window={window} />
          )}
          {window === 'ongoing-games' && (
            <OngoingGames setWindow={setWindow} window={window}/>
          )}
          {window === 'archives' && (
            <Archives setWindow={setWindow} window={window}/>
          )}

        </div>

      </div>

    </div>
  )
}

export default Setup