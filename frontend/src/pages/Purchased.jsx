import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
const Purchased = () => {
  const [home, setHome] = useState([]);
  const homeId = parseInt(window.location.pathname.split('/').pop());

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
  
  useEffect(() => {
    fetchData();
  }, [])

  console.log(home)

  return (      
    <>
    <Navbar />
    <div>
      <h1>Congrats on buying {home.address}</h1>
      <img src={`${home.image}`} alt={`${home.address}`}  height={200}/>
      <a href={`/dashboard/${homeId}`}><button>Access Home Dashboard</button></a>
      <a href={`https://testnets.opensea.io/assets/sepolia/0xefbbf3a86f40ddbd01375f3aedfa82ed720da131/${homeId}`}><button>View NFT on OpenSea</button></a>
    </div>
    </>
  )
}

export default Purchased