import React, { useEffect, useState } from 'react';
import axios from "axios";
import NFTAbi from '../ContractsData/MyNFT.json'
import NFTAddress from '../ContractsData/MyNFT-address.json'
import { ethers } from "ethers"
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';

const Dashboard = () => {
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
        const res = await axios.post(`http://localhost:8800/api/homes/getSingleHome`, {
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

    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)
        setIsYourHome(account === owner ? true : false)
    }

    console.log(owner)

    return (
        <>         
        <Navbar />             
        {account === null && <button onClick={connectHandler}>Connect to MetaMask</button>}
        {account !== null && isYourHome === true && <div>Dashboard</div>}
        {account !== null && isYourHome === false && <div>
            <h1>You do not own this home!</h1>
            <a href="/myhomes"><button>Return to My Homes</button></a>
        </div>}
        </>
    )
}

export default Dashboard