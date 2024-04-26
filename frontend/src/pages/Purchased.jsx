import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';

const Purchased = () => {
  const [home, setHome] = useState([]);
  const homeId = parseInt(window.location.pathname.split('/').pop());

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
  
  useEffect(() => {
    fetchData();
  }, [])

  console.log(home)

  return (      
    <>
    <Navbar />
    <div className='mainBody'>
      <div>
        <h1>Congrats on buying {home.address}</h1>
        <img src={`${home.image}`} alt={`${home.address}`}  height={200}/>
        <a href={`/dashboard/${homeId}`}><button>Access Home Dashboard</button></a>
        <a href={`${import.meta.env.VITE_OPENSEA_LINK}/${homeId}`}><button>View NFT on OpenSea</button></a>
      </div>
    </div>
    </>
  )
}

export default Purchased