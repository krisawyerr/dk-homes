import React, { useEffect, useState } from 'react';
import axios from "axios";
import NFTAbi from '../ContractsData/MyNFT.json'
import NFTAddress from '../ContractsData/MyNFT-address.json'
import { ethers } from "ethers"
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';

const Purchase = () => {
  const navigate = useNavigate();
  const [home, setHome] = useState([]);
  const homeId = parseInt(window.location.pathname.split('/').pop());
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [tokenMaster, setTokenMaster] = useState(null)
  const [loading, setLoading] = useState(false)
  const [nftCost, setNftCost] = useState(0)
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
  }
  
  useEffect(() => {
    fetchData();
    loadBlockchainData()
  }, [])

  const updateHomeForSaleStatus = async () => {
    try {
      const res = await axios.post(`http://localhost:8800/api/homes/makeHomeSold`, {
        id: homeId,
      });
      setHome(res.data[0]);
    } catch(err) {
      console.log(err);
    }
  };

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }

  const mintNFT = async () => {
    setLoading(true)

    const uri = `https://copper-kind-coyote-634.mypinata.cloud/ipfs/QmdrXBsMEWv4oWX8KTVy1RDRLmwsNSuf3m7TwXrdRZueE6/${tokenId}.json`

    const signer = await provider.getSigner()
    // const valueInWei = ethers.utils.parseEther(`${home.cost}`);
    const valueInWei = ethers.utils.parseEther(`0`);

    try {
      const transaction = await tokenMaster.connect(signer).createNFT(uri, tokenId, { value: valueInWei });
      await transaction.wait();
      await updateHomeForSaleStatus()
      navigate(`/purchased/${homeId}`);
    } catch (error) {
      console.log(error)

      if (error.message.includes("insufficient funds")) {
        console.log("HIIIIIIII");
      } else if (error.message.includes("user rejected transaction")) {
        console.log("BYYYEEEEEE");
      } else if (error.message.includes("Cannot read properties of null")) {
        console.log("HOOOLLLAAAA");
      } else if (error.message.includes("Home with this ID already exists")) {
        console.log("ADDDIIIOOOOSSSSS");
      } else {
        console.log("ERRROOOOOORRRRR");
      }
    } finally {
      setLoading(false);
    }
  }
  
  return (   
    <> 
    <Navbar />
    <div className='purchseGrid'>
      <div>
        <img src={`${home.image}`} alt={`${home.address}`}  height={200}/>
        <div>{home.id} - {home.address} - {home.beds} - {home.baths} - {home.cost}</div>
      </div>
      <div className='formSection'>
          <div className='formCard'>
            <h2>Mint your Fish Trophy</h2>

            <div className='price'>
              <div>{nftCost} Matic</div>
              <div>Sale is active!</div>
            </div>

            <div className='rarityChange'>
              <input type="checkbox" onChange={() => setNftCost(nftCost === 0 ? 5 : 0)} checked={nftCost !== 0}/>
              <div>Increse Rarity Probability: +5 Matic</div>
            </div>

            {loading ? (
              <button>Loading...</button>
            ) : (
              account ? (
                <button onClick={mintNFT}>Mint Random Fish Trophy</button>
              ) : (
                <button onClick={connectHandler}>Connect to MetaMask</button>
              )
            )}
          </div>
        </div>
    </div>
    </>  
  )
}

export default Purchase