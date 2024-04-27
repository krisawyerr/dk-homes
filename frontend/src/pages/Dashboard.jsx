import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import NFTAbi from '../ContractsData/MyNFT.json'
import NFTAddress from '../ContractsData/MyNFT-address.json'
import { ethers } from "ethers"
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import { AuthContext } from "../context/authContext";
import Loader from '../components/Loader';

const Dashboard = () => {  
    const { currentUser, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [home, setHome] = useState([]);
    const homeId = parseInt(window.location.pathname.split('/').pop());
    const [provider, setProvider] = useState(null)
    const [account, setAccount] = useState(null)
    const [tokenMaster, setTokenMaster] = useState(null)
    const [owner, setOwner] = useState()
    const [loading, setLoading] = useState(false)
    const [nftCost, setNftCost] = useState(0)
    const [isYourHome, setIsYourHome] = useState(false)
    const [editOpen, setEditOpen] = useState(0)
    const [fullName, setFullName] = useState()
    const [gateCode, setGateCode] = useState()
    const [doorCode, setDoorCode] = useState()
    /* const network = 'matic' */
    const cryptoNetwork = 'sepolia'
    const tokenId = homeId < 10 ? `0${homeId}` : `${homeId}`

    const fetchData = async () => {
        try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/getSingleHome`, {
            id: homeId,
        });
        setHome(res.data[0]);
        if (res.data[0].owner !== null) {
          setFullName(res.data[0].owner)  
        }
        if (res.data[0].gateCode !== null) {
          setGateCode(res.data[0].gateCode)  
        }
        if (res.data[0].doorCode !== null) {
          setDoorCode(res.data[0].doorCode)  
        }
        } catch(err) {
        console.log(err);
        }
    };
  
    const loadBlockchainData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, cryptoNetwork)
        setProvider(provider)
    
        const network = await provider.getNetwork()
        const tokenMasterr = new ethers.Contract(NFTAddress.address, NFTAbi, provider)
        setTokenMaster(tokenMasterr)

        const ownerAddress = await tokenMasterr.ownerOf(tokenId)
        setOwner(ownerAddress)
    }
  
    useEffect(() => {
        fetchData();
        loadBlockchainData()
    }, [])

    async function handleLogin() {
        try {
          await login()
          window.location.reload();
        } catch (err) {
          setErr(err.response.data);
        }
    }

    const changeOwner = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/updateOwnerName`, {
                id: homeId,
                owner: fullName,
            });   
            window.location.reload();   
        } catch (error) {
            console.error(error)
        }
    };

    const changeGateCode = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/updateGateCode`, {
                id: homeId,
                gateCode: gateCode,
            });   
            window.location.reload();   
        } catch (error) {
            console.error(error)
        }
    };

    const changeDoorCode = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/updateDoorCode`, {
                id: homeId,
                doorCode: doorCode,
            });   
            window.location.reload();   
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <>         
        <Navbar />
        {!home || !owner && <Loader />}
        {home && owner && <div className='mainBody'>
            {currentUser && owner === currentUser.username && <div className='dashboardGrid'>
                <div className='dashboardStats'>
                    <img src={`${home.image}`} alt={`${home.address}`}/>   
                    <div className='dashboardInfo'>
                        <div className='bottomLine'><span>{home.address}</span><br/>Los Iveros, NV</div>               
                        <div className='bottomLine'><span>{home.beds}</span> Beds</div>               
                        <div className='bottomLine'><span>{home.baths}</span> Baths</div>               
                        <div><span>{home.cost}</span> Matic</div>                          
                    </div>  
                </div>
                <div className='dashboardDetails'>
                    <div className='proprertyDetails'>Property Details</div>
                    <div className='detailSection'>
                        <div>Owner Full Name:</div>
                        {editOpen !== 1 && <div className='detailRow'>
                            <div>{home.owner === null ? "House owner unassigned." : home.owner}</div>
                            <img src="/edit.svg" alt="edit info" onClick={() => setEditOpen(1)}/>
                        </div>}
                        {editOpen === 1 && <div className='detailRow'>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='Enter full name here'/>
                            <div>
                                <button className='save' onClick={changeOwner}>Save</button>
                                <button className='cancel' onClick={() => {setEditOpen(0); home.owner !== null ? setFullName(home.owner) : setFullName('')}}>Cancel</button>
                            </div>    
                        </div>}
                    </div>
                    <div className='detailSection'>
                        <div>House Gate Code:</div>
                        {editOpen !== 2 && <div className='detailRow'>
                            <div>{home.gateCode === null ? "House gate code unassigned." : home.gateCode}</div>
                            <img src="/edit.svg" alt="edit info" onClick={() => setEditOpen(2)}/>
                        </div>}
                        {editOpen === 2 && <div className='detailRow'>
                            <input type="text" value={gateCode} onChange={(e) => setGateCode(e.target.value)} placeholder='Enter gate code here'/>
                            <div>
                                <button className='save' onClick={changeGateCode}>Save</button>
                                <button className='cancel' onClick={() => {setEditOpen(0); home.gateCode !== null ? setGateCode(home.gateCode) : setGateCode('')}}>Cancel</button>
                            </div>    
                        </div>}
                    </div>
                    <div className='detailSection'>
                        <div>House Doors Code:</div>
                        {editOpen !== 3 && <div className='detailRow'>
                            <div>{home.doorCode === null ? "House doors code unassigned." : home.doorCode}</div>
                            <img src="/edit.svg" alt="edit info" onClick={() => setEditOpen(3)}/>
                        </div>}
                        {editOpen === 3 && <div className='detailRow'>
                            <input type="text" value={doorCode} onChange={(e) => setDoorCode(e.target.value)} placeholder='Enter door code here'/>
                            <div>
                                <button className='save' onClick={changeDoorCode}>Save</button>
                                <button className='cancel' onClick={() => {setEditOpen(0); home.doorCode !== null ? setDoorCode(home.doorCode) : setDoorCode('')}}>Cancel</button>
                            </div>    
                        </div>}
                    </div>
                </div>
            </div>}

            {!currentUser && <div className='signInPage'>
                <div className='signInText'>
                    <div className='signInTitle'>Sign in to see your homes!</div>
                    <div className='signInBody'>To access the homes you own, simply sign in to your account. Once logged in, you can manage all your properties effortlessly and stay updated on all property-related activities.</div>
                    <div className='signInButton'><button onClick={handleLogin}>Connect to Metamask</button></div>
                </div>
                <div>
                    <img src="/mac.png" alt="My Homes Page" className='macImage'/>
                    <img src="/iphone.png" alt="My Homes Page" className='phoneImage'/>
                </div>
            </div>}
        </div>}
        </>
    )
}

export default Dashboard