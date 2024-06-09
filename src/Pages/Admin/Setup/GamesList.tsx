import React, { useEffect } from 'react'
import searchIcon from '../../../Assets/Images/searchIcon.png'
import filterIcon from '../../../Assets/Images/filterIcon.png'
import { useLocation } from 'react-router-dom';
import './Setup.css'
import { Audio, Oval } from 'react-loader-spinner'
import Popup from 'reactjs-popup';
import openeye from '../../../Assets/Images/openeye.png'

import ImageUploader from 'react-image-upload'

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

const GamesList = ({setWindow, window}) => {

    const location = useLocation();

    const baseUri = process.env.REACT_APP_BASE_URL

    const [gameListData, setGameListData] = React.useState([])

    const [openedGame, setOpenedGame] = React.useState<gameOverview>({
        id: null,
        gameType: '',
        variationName: '',
        mobileBanner: '',
        siteBanner: '',
        isNewGame: false,
        productImage: '',
        additionalDetails: {
            backgroundImage: '',
            trainerBackgroundImage: '',
            playerBackgroundImage: '',
            img2: '',
            img6: '',
            img12: '',
            img16: '',
            img21: '',
            img25: '',
            img28: '',
            img33: '',
            img38: '',
            img41: '',
            img45: '',
            img48: '',
            img51: '',
            img58: '',
        }
    })


    const [isLoading, setIsLoading] = React.useState(false)

    const [openPopup, setOpenPopup] = React.useState(false);

    const [previewedImage, setPreviewedImage] = React.useState('');

    const fetchGamesList = async () => {
        try {
            const gamelistResponse = await fetch(`${baseUri}/api/variation/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
            })

            const gamesListResdata = await gamelistResponse.json()
            console.log("gamelistResponse", gamesListResdata)
            setGameListData(gamesListResdata)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGamesList();
    }, [])

    const openGame = (game: gameOverview) => {
        setOpenedGame({
            id: game.id,
            gameType: game.gameType,
            variationName: game.variationName,
            mobileBanner: game.mobileBanner,
            siteBanner: game.siteBanner,
            isNewGame: false,
            productImage: game.productImage,
            additionalDetails: {
                backgroundImage: game.additionalDetails.backgroundImage,
                trainerBackgroundImage: game.additionalDetails.trainerBackgroundImage,
                playerBackgroundImage: game.additionalDetails.playerBackgroundImage,
                img2: game.additionalDetails.img2,
                img6: game.additionalDetails.img6,
                img12: game.additionalDetails.img12,
                img16: game.additionalDetails.img16,
                img21: game.additionalDetails.img21,
                img25: game.additionalDetails.img25,
                img28: game.additionalDetails.img28,
                img33: game.additionalDetails.img33,
                img38: game.additionalDetails.img38,
                img41: game.additionalDetails.img41,
                img45: game.additionalDetails.img45,
                img48: game.additionalDetails.img48,
                img51: game.additionalDetails.img51,
                img58: game.additionalDetails.img58,
            }
        })
    }

    const handleUpdateExistingGame = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            gameType: openedGame.gameType,
            variationName: openedGame.variationName,
            mobileBanner: openedGame.mobileBanner,
            siteBanner: openedGame.siteBanner,
            additionalDetails: {
                backgroundImage: openedGame.additionalDetails.backgroundImage,
                trainerBackgroundImage: openedGame.additionalDetails.trainerBackgroundImage,
                playerBackgroundImage: openedGame.additionalDetails.playerBackgroundImage,
                img2: openedGame.additionalDetails.img2,
                img6: openedGame.additionalDetails.img6,
                img12: openedGame.additionalDetails.img12,
                img16: openedGame.additionalDetails.img16,
                img21: openedGame.additionalDetails.img21,
                img25: openedGame.additionalDetails.img25,
                img28: openedGame.additionalDetails.img28,
                img33: openedGame.additionalDetails.img33,
                img38: openedGame.additionalDetails.img38,
                img41: openedGame.additionalDetails.img41,
                img45: openedGame.additionalDetails.img45,
                img48: openedGame.additionalDetails.img48,
                img51: openedGame.additionalDetails.img51,
                img58: openedGame.additionalDetails.img58,
            },
            status: 1,
        }
        console.log("data", data)

        try {
            const response = await fetch(`${baseUri}/api/variation/${openedGame.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            })

            console.log("response", response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSaveNewGame = async (e: React.FormEvent) => {
        console.log("openedGame", openedGame)

        if (openedGame.gameType === '') {
            alert("Please fill Game Type")
            return
        }
        if (openedGame.variationName === '') {
            alert("Please fill Variation Name")
            return
        }
        if (openedGame.mobileBanner === '' || openedGame.mobileBanner === undefined) {
            alert("Please Upload Mobile Banner")
            return
        }
        if (openedGame.siteBanner === '') {
            alert("Please Upload Site Banner")
            return
        }

        if (openedGame.additionalDetails.backgroundImage === '' || openedGame.additionalDetails.backgroundImage === undefined) {
            alert("Please Upload Background Image")
            return
        }

        if (openedGame.additionalDetails.trainerBackgroundImage === '' || openedGame.additionalDetails.trainerBackgroundImage === undefined) {
            alert("Please Upload Trainer Background Image")
            return
        }

        if (openedGame.additionalDetails.playerBackgroundImage === '' || openedGame.additionalDetails.playerBackgroundImage === undefined) {
            alert("Please Upload Player Background Image")
            return
        }

        if (openedGame.additionalDetails.img2 === '' || openedGame.additionalDetails.img2 === undefined) {
            alert("Please Upload Ladder 2 Popup")
            return
        }

        if (openedGame.additionalDetails.img6 === '' || openedGame.additionalDetails.img6 === undefined) {
            alert("Please Upload Ladder 5 Popup")
            return
        }

        if (openedGame.additionalDetails.img12 === '' || openedGame.additionalDetails.img12 === undefined) {
            alert("Please Upload Ladder 10 Popup")
            return
        }

        if (openedGame.additionalDetails.img16 === '' || openedGame.additionalDetails.img16 === undefined) {
            alert("Please Upload Snake 13 Popup")
            return
        }

        if (openedGame.additionalDetails.img21 === '' || openedGame.additionalDetails.img21 === undefined) {
            alert("Please Upload Ladder 17 Popup")
            return
        }

        if (openedGame.additionalDetails.img25 === '' || openedGame.additionalDetails.img25 === undefined) {
            alert("Please Upload Snake 20 Popup")
            return
        }

        if (openedGame.additionalDetails.img28 === '' || openedGame.additionalDetails.img28 === undefined) {
            alert("Please Upload Ladder 22 Popup")
            return
        }

        if (openedGame.additionalDetails.img33 === '' || openedGame.additionalDetails.img33 === undefined) {
            alert("Please Upload Snake 26 Popup")
            return
        }

        if (openedGame.additionalDetails.img38 === '' || openedGame.additionalDetails.img38 === undefined) {
            alert("Please Upload Snake 30 Popup")
            return
        }

        if (openedGame.additionalDetails.img41 === '' || openedGame.additionalDetails.img41 === undefined) {
            alert("Please Upload Ladder 32 Popup")
            return
        }

        if (openedGame.additionalDetails.img45 === '' || openedGame.additionalDetails.img45 === undefined) {
            alert("Please Upload Ladder 35 Popup")
            return
        }

        if (openedGame.additionalDetails.img48 === '' || openedGame.additionalDetails.img48 === undefined) {
            alert("Please Upload Ladder 37 Popup")
            return
        }

        if (openedGame.additionalDetails.img51 === '' || openedGame.additionalDetails.img51 === undefined) {
            alert("Please Upload Snake 39 Popup")
            return
        }

        if (openedGame.additionalDetails.img58 === '' || openedGame.additionalDetails.img58 === undefined) {
            alert("Please Upload Snake 45 Popup")
            return
        }


        e.preventDefault();
        createNewGame(e)

    }

    const createNewGame = async (e: React.FormEvent) => {
        console.log("openedGame", openedGame)
        try {
            const response = await fetch(`${baseUri}/api/variation/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    gameType: openedGame.gameType,
                    variationName: openedGame.variationName,
                    mobileBanner: openedGame.mobileBanner,
                    productImage: openedGame.productImage,
                    siteBanner: openedGame.siteBanner,
                    additionalDetails: {
                        backgroundImage: openedGame.additionalDetails.backgroundImage,
                        trainerBackgroundImage: openedGame.additionalDetails.trainerBackgroundImage,
                        playerBackgroundImage: openedGame.additionalDetails.playerBackgroundImage,
                        img2: openedGame.additionalDetails.img2,
                        img6: openedGame.additionalDetails.img6,
                        img12: openedGame.additionalDetails.img12,
                        img16: openedGame.additionalDetails.img16,
                        img21: openedGame.additionalDetails.img21,
                        img25: openedGame.additionalDetails.img25,
                        img28: openedGame.additionalDetails.img28,
                        img33: openedGame.additionalDetails.img33,
                        img38: openedGame.additionalDetails.img38,
                        img41: openedGame.additionalDetails.img41,
                        img45: openedGame.additionalDetails.img45,
                        img48: openedGame.additionalDetails.img48,
                        img51: openedGame.additionalDetails.img51,
                        img58: openedGame.additionalDetails.img58,
                    },
                    status: '1',
                })
            })

            if (response.status === 200) {
                fetchGamesList();
            }

            console.log("response", response)

        } catch (error) {
            console.log(error)
        }

    }


    const handleSave = async (e: React.FormEvent) => {
        if (openedGame.isNewGame) {
            handleSaveNewGame(e)
            return
        } else {
            handleUpdateExistingGame(e)
        }
    }

    const handleCancelGameDetailsUpdates = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpenedGame({
            id: null,
            gameType: '',
            variationName: '',
            mobileBanner: '',
            siteBanner: '',
            isNewGame: false,
            productImage: '',
            additionalDetails: {
                backgroundImage: '',
                trainerBackgroundImage: '',
                playerBackgroundImage: '',
                img2: '',
                img6: '',
                img12: '',
                img16: '',
                img21: '',
                img25: '',
                img28: '',
                img33: '',
                img38: '',
                img41: '',
                img45: '',
                img48: '',
                img51: '',
                img58: '',
            }
        })

    }

    const handleOpenNewGameForm = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpenedGame({
            id: '',
            gameType: '',
            variationName: '',
            mobileBanner: '',
            siteBanner: '',
            isNewGame: true,
            productImage: '',
            additionalDetails: {
                backgroundImage: '',
                trainerBackgroundImage: '',
                playerBackgroundImage: '',
                img2: '',
                img6: '',
                img12: '',
                img16: '',
                img21: '',
                img25: '',
                img28: '',
                img33: '',
                img38: '',
                img41: '',
                img45: '',
                img48: '',
                img51: '',
                img58: '',
            }
        })
    }

    const uploadImage = async (imageFile) => {
        setIsLoading(true)
        const formData = new FormData();
        formData.append('file', imageFile.file);

        try {
            const uploadImage = await fetch(`${baseUri}/upload/info`, {
                method: 'POST',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: formData
            })

            const uploadedImageUrl = await uploadImage.text()

            const encodedFilePath = convertAndEncodePath(uploadedImageUrl);

            console.log("uploadSiteBannerData", encodedFilePath)

            if (uploadImage.status === 200) {
                setIsLoading(false)
                return encodedFilePath;
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const handleSelectImage = async (imageFile, field) => {
        const encodedFilePath = await uploadImage(imageFile);
        console.log("uploadSiteBannerData", encodedFilePath)

        if (encodedFilePath) {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                setOpenedGame(prevState => ({
                    ...prevState,
                    [parent]: {
                        ...prevState[parent],
                        [child]: encodedFilePath,
                    },
                }));
            } else {
                setOpenedGame(prevState => ({
                    ...prevState,
                    [field]: encodedFilePath,
                }));
            }
        }
    }

    function runAfterImageDelete(file) {
        console.log({ file })
    }

    function convertAndEncodePath(filePath) {
        const normalizedPath = filePath.replace(/\\/g, '/');

        const encodedPath = encodeURIComponent(normalizedPath);

        return encodedPath;
    }

    const handlePreviewImage = async (imageUrl) => {
        // console.log("imageUrl", imageUrl)

        if (imageUrl === '' || imageUrl === undefined) {
            return
        }

        setIsLoading(true)

        try {
            const image = await fetch(`${baseUri}/download/${imageUrl}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
            })

            const imageBlob = await image.blob()
            const imageSrc = URL.createObjectURL(imageBlob);
            setOpenPopup(false)
            setPreviewedImage(imageSrc)
            setOpenPopup(true)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setOpenPopup(false)
            setIsLoading(false)
        }
    }


    const handleGameTypeInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("e.target.value", e.target.value)
        setOpenedGame(prevState => ({
            ...prevState,
            gameType: e.target.value
        }));
    }

    const handleVariationNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpenedGame(prevState => ({
            ...prevState,
            variationName: e.target.value
        }));
    }

    const handleClosePopup = () => {
        setOpenPopup(false)
    }

    const handleChangeTab = (tab) => {
        setWindow(tab)
    }


    return (
        <div className='adminGamesListMain'>
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
            <div className="setupPanel">
                <h3 className="trainingGamesHeader">Training Games &gt; Setup</h3>

                <div className="panelBtns">
                    <div className="LiveAndArchiveBtns">
                        <button className={`${window === 'games-list' ? 'openedWindow' :''}`} onClick={ () => handleChangeTab('games-list')}>Games List</button>
                        <button className={`${window === 'ongoing-games' ? 'openedWindow' :''}`} onClick={ () => handleChangeTab('ongoing-games')}>Ongoing Games</button>
                        <button className={`${window === 'archives' ? 'openedWindow' :''}`} onClick={ () => handleChangeTab('archives')}>Archives</button>
                    </div>
                    <div className="basicDetailsHeaderBtns">
                        <button className="basicDetailsHeaderPreviewBtn">PREVIEW</button>
                        <button className="" onClick={handleSave}>SAVE</button>
                        <button className="" onClick={handleCancelGameDetailsUpdates}>CANCEL</button>
                        <button className="">ARCHIVE</button>
                    </div>
                </div>


            </div>
            <div className="listAndDetailsContainer">
                <div className="listContainer">
                    <div className="listTableTopDiv">
                        <h2 className="">LIST</h2>
                        <div className="searchAndFilterIcons">
                            <img src={searchIcon} alt="" className='searchIcon' />
                            <img src={filterIcon} alt="" className='filterIcon' />
                        </div>
                    </div>
                    <table className='adminListTable'>
                        <thead>
                            <tr className='listTableHeader'>
                                <th>Sno</th>
                                <th>Game Type</th>
                                <th>Variation Name</th>
                                <th>Banner</th>
                                <th>View</th>
                                <th>Duplicate</th>
                            </tr>
                        </thead>
                        <tbody className='listTableBody'>
                            {gameListData?.map((game: gameOverview, index) => (
                                <tr key={index}>
                                    <td>{game.id}</td>
                                    <td>{game.gameType}</td>
                                    <td>{game.variationName}</td>
                                    <td>{game.mobileBanner}</td>
                                    <td className='viewColumn'><img className='openEye' onClick={() => openGame(game)} src={openeye} alt='openeye'></img></td>
                                    <td><button className='duplicateBtn'>Duplicate</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='addGameBtn' onClick={handleOpenNewGameForm}>Add Game</button>
                </div>
                <div className="detailsContainer">
                    {openedGame.id === null ? (
                        <div className="">No opened Game</div>
                    ) : (
                        <div className="rightContainers">
                            <div className="basicDetailsContainer">
                                <div className="basicDetailsHeader">
                                    <span className="basicDetails">BASIC DETAILS</span>
                                    <span className="">{`opened game: ${openedGame.id}`}</span>
                                </div>
                                <div className="basicDetailsPanel">
                                    <div className="IDAndGameTypeContainer">
                                        <div className="IDContainer">
                                            {/* <span className="">ID</span>
                          <input type="text" className="" value={openedGame.customId} onChange={handleIDInputChange}></input> */}
                                            <span className="">VARIATION NAME</span>
                                            <input type="text" className="" value={openedGame.variationName} onChange={handleVariationNameInputChange} ></input>
                                        </div>
                                        <div className="GameTypeContainer">
                                            <span className="">Game Type</span>
                                            <select className='gametTypeSelect' defaultValue={''} value={openedGame.gameType} onChange={handleGameTypeInputChange}>
                                                <option value="snl">SNL</option>
                                                <option value="kbc">KBC</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="VariationNameContainer">
                                        {/* <span className="">VARIATION NAME</span>
                        <input type="text" className="" value={openedGame.variationName} onChange={handleVariationNameInputChange} ></input> */}
                                    </div>
                                    <div className="SiteBannerContainer">
                                        <span className="">Add Site Banner<br />(xx px by YY px)</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    // onFileAdded={(img) => handleSelectSiteBannerImage(img)}
                                                    onFileAdded={(img) => handleSelectImage(img, 'siteBanner')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.siteBanner !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.siteBanner)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="SiteBannerContainer">
                                        <span className="">Add Product Image</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    // onFileAdded={(img) => handleSelectSiteBannerImage(img)}
                                                    onFileAdded={(img) => handleSelectImage(img, 'productImage')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.productImage !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.productImage)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="MobileBannerContainer">
                                        <span className="">Add Mobile Banner<br />(xx px by YY px)</span>
                                        <div className="MobileBannerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'mobileBanner')}
                                                // onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.mobileBanner !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.mobileBanner)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="additionalDetailsContainer">
                                <div className="additionalDetailsHeader">
                                    <span className="additionalDetails">ADDITIONAL DETAILS</span>
                                </div>
                                <div className="additionalDetailsPanel">
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Add Board Background Image<br />(xx px by YY px)</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.backgroundImage')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.backgroundImage !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.backgroundImage)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="AdditionalDetailsRow">
                                        <span className="">Add Trainer Background Image<br />(xx px by YY px)</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.trainerBackgroundImage')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.trainerBackgroundImage !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.trainerBackgroundImage)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>




                                    <div className="AdditionalDetailsRow">
                                        <span className="">Add Player Background Image<br />(xx px by YY px)</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.playerBackgroundImage')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.playerBackgroundImage !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.playerBackgroundImage)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>




                                    <div className="AdditionalDetailsRow">
                                        <span className="">Ladder 2 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img2')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img2 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img2)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Ladder 5 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img6')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img6 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img6)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Ladder 10 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img12')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img12 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img12)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Snake 13 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img16')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img16 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img16)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Ladder 17 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img21')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img21 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img21)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Snake 20 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img25')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img25 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img25)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Ladder 22 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img28')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img28 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img28)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Snake 26 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img33')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img33 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img33)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Snake 30 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img38')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img38 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img38)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Ladder 32 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img41')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img41 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img41)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Ladder 35 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img45')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img45 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img45)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Ladder 37 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img48')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img48 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img48)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Snake 39 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img51')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img51 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img51)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdditionalDetailsRow">
                                        <span className="">Snake 45 Pop up</span>
                                        <div className="SiteBannerContainerBtns">
                                            <button className="uploadBtn">
                                                <ImageUploader
                                                    style={{ height: 29, width: 156, background: '##F9F7F7' }}
                                                    uploadIcon='Upload'
                                                    deleteIcon=''
                                                    onFileAdded={(img) => handleSelectImage(img, 'additionalDetails.img58')}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </button>
                                            <div className="PreviewAndDeleteBtns">
                                                <button className={`previewBtn ${openedGame.additionalDetails.img58 !== "" ? 'previewBtnActive' : ''}`} onClick={() => handlePreviewImage(openedGame.additionalDetails.img58)}>Preview</button>
                                                <button className="deleteBtn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default GamesList