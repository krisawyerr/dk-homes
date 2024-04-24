import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';

const Home = () => {
  const [homes, setHomes] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/api/homes/getHomes`);
      setHomes(res.data);
    } catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(homes);
  
  return (
    <>
      <Navbar />
      <div>Home</div>
      <div className='homeGrid'>
        {homes.map(home => (
          <div key={home.id}>
            <img src={`${home.image}`} alt={`${home.address}`}  height={200}/>
            <div>{home.id} - {home.address} - {home.beds} - {home.baths} - {home.cost}</div>
            <a href={home.owned === "FALSE" ? `/purchase/${home.id}`: null}>
              {home.owned === "FALSE" ? <button style={{width: 300, marginBottom: 20}}>Buy {home.address}</button> : <button style={{width: 300, marginBottom: 20, backgroundColor: 'red'}}>Sold</button>}
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
