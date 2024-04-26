import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import NFTAbi from '../ContractsData/MyNFT.json'
import NFTAddress from '../ContractsData/MyNFT-address.json'
import { ethers } from "ethers"
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import { AuthContext } from "../context/authContext";

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
    /* const network = 'matic' */
    const cryptoNetwork = 'sepolia'
    const tokenId = homeId < 10 ? `0${homeId}` : `${homeId}`

    const fetchData = async () => {
        try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/getSingleHome`, {
            id: homeId,
        });
        setHome(res.data[0]);
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

    return (
        <>         
        <Navbar />
        <div className='mainBody'>
            {currentUser && owner === currentUser.username && <div>
                <img src={`${home.image}`} alt={`${home.address}`}  height={200}/>
                <div>{home.id} - {home.address} - {home.beds} - {home.baths} - {home.cost}</div>
            </div>}

            {currentUser && owner !== currentUser.username && <div>
                <h1>You do not own this home!</h1>
                <a href="/myhomes"><button>Return to My Homes</button></a>
            </div>}

            {!currentUser && <div>Sign in to see homes!</div>}
        </div>
        </>
    )
}

export default Dashboard