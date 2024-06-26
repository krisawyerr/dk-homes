import React, { useEffect, useState } from 'react';
import axios from "axios";
import NFTAbi from '../ContractsData/MyNFT.json'
import NFTAddress from '../ContractsData/MyNFT-address.json'
import { ethers } from "ethers"
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

const Purchase = () => {
  const navigate = useNavigate();
  const [home, setHome] = useState([]);
  const homeId = parseInt(window.location.pathname.split('/').pop());
  const [provider, setProvider] = useState(null)
  const [tokenMaster, setTokenMaster] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const cryptoNetwork = 'matic'
  // const cryptoNetwork = 'sepolia'
  const tokenId = homeId < 10 ? `0${homeId}` : `${homeId}`

  const fetchData = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/getSingleHome`, {
        id: homeId,
      });
      setHome(res.data[0]);
    } catch(err) {
      console.error(err);
    }
  };
  
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  
      window.ethereum.on('chainChanged', handleChainChanged);
  
      const network = await provider.getNetwork()
      if (network.name !== cryptoNetwork) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }]
        });
      }
      
      const tokenMasterr = new ethers.Contract(NFTAddress.address, NFTAbi, provider)
      setTokenMaster(tokenMasterr)

  }
  
  const handleChainChanged = async (chainId) => {
    if (chainId !== '0x89') {
      alert("Please switch to the Polygon network");
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }] 
      });
    } else {
      window.location.reload();
    }
  }
  
  useEffect(() => {
    fetchData();
    loadBlockchainData()
  }, [])

  const updateHomeForSaleStatus = async (owner) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/makeHomeSold`, {
        id: homeId,
      });
      await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/updateOwner`, {
        id: homeId,
        owner,
      });
    } catch(err) {
      console.error(err);
    }
  };

  const mintNFT = async () => {
    setErrorMessage("");
    setLoading(true)

    const uri = `${import.meta.env.VITE_PINATA_LINK}/${tokenId}.json`

    const signer = await provider.getSigner()
    // const valueInWei = ethers.utils.parseEther(`${home.cost}`);
    const valueInWei = ethers.utils.parseEther(`0`);

    try {
      const transaction = await tokenMaster.connect(signer).createNFT(uri, tokenId, { value: valueInWei });
      await transaction.wait();

      await updateHomeForSaleStatus(transaction.from)
      navigate('/myhomes');
    } catch (error) {
      if (error.message.includes("insufficient funds")) {
        setErrorMessage("Insufficient Funds!");
      } else if (error.message.includes("user rejected transaction")) {
        setErrorMessage("User Rejected Transaction!");
      } else if (error.message.includes("Cannot read properties of null")) {
        setErrorMessage("User Not On Polygon Network!");
      } else if (error.message.includes("Home with this ID already exists")) {
        setErrorMessage("Home Already Sold!");
      } else {
        setErrorMessage("Error Selling Home!");
      }
    } finally {
      setLoading(false);
    }
  }
  
  return (   
    <> 
      <Navbar />
      {!home || !tokenMaster && <Loader />}
      {home && tokenMaster && <div className='mainBody'>
        <div>
          <div className='purchaseAddress'><span>{home.address}</span><br />Los Iveros, NV</div>
          <div className='purchaseInfo'>
            <div className='sideBorder purchaseCost'>from<span> {home.cost} Matic</span></div>
            <div className='sideBorder purchaseStats'>
              <div>
                <span>{home.beds}</span>
                <div>BEDS</div>
              </div>
              <div>
                <span>{home.baths}</span>
                <div>BATHS</div>
              </div>
              <div>
                <span>2</span>
                <div>CARS</div>
              </div>
              <div>
                <span>2</span>
                <div>STORIES</div>
              </div>
              <div>
                <span>1,634</span>
                <div>SQFT</div>
              </div>
            </div>
            {loading ? (
              <div className='purchaseButton'><button onClick={mintNFT}>Loading...</button></div>
              ) : (
              <div className='purchaseButton'><button onClick={mintNFT}>Buy {home.address}</button></div>
            )}
          </div>
          {errorMessage !== "" && <div className='errorMessage'>{errorMessage}</div>}
          <div className='photoGrid'>
            <div className='photoGridTop'>
              <div>
                <img src={`${home.image}`} alt={`${home.address}`}/>
              </div>
              <div className='photoGridTopRight'>
                <img src={`${import.meta.env.VITE_PHOTO_SERVER_LINK}/1.webp`} alt="" />              
                <img src={`${import.meta.env.VITE_PHOTO_SERVER_LINK}/2.webp`} alt="" />
              </div>
            </div>
            <div className='photoGridBottom'>
              <img src={`${import.meta.env.VITE_PHOTO_SERVER_LINK}/3.webp`} alt="" />
              <img src={`${import.meta.env.VITE_PHOTO_SERVER_LINK}/4.webp`} alt="" />
              <img src={`${import.meta.env.VITE_PHOTO_SERVER_LINK}/5.webp`} alt="" />
            </div>
          </div>
        </div>
      </div>}
    </>  
  )
}

export default Purchase