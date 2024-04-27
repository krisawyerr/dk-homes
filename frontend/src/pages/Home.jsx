import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import { AuthContext } from "../context/authContext";
import Loader from '../components/Loader';

const Home = () => {
  const [homes, setHomes] = useState([]);
  const [filterOne, setFilterOne] = useState("homes => homes.owned !== ''");
  const [filterTwo, setFilterTwo] = useState("homes => homes.baths > 0");
  const [filterThree, setFilterThree] = useState("homes => homes.beds > 0");
  const [filterFour, setFilterFour] = useState("homes => homes.cost > 0");
  const filterFunction = new Function("homes", `return (${filterOne})(homes) && (${filterTwo})(homes) && (${filterThree})(homes) && (${filterFour})(homes);`);
  const filteredHome = homes.filter(filterFunction);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_LINK}/api/homes/getHomes`);
      setHomes(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function resetFilter() {
    window.location.reload();
  }

  
  return (
    <>
      <Navbar />
      {!homes && <Loader />}
      {homes && <div className='mainBody'>
        <h1><span>New homes in </span>Los Iveros, NV</h1>

        <div className='filterGrid'>
          <select name="Status" id="Status" onChange={(e) => setFilterOne(`homes => homes.owned !== '${e.target.value}'`)}>
            <option value="" defaultValue>Status</option>
            <option value="TRUE">For Sale</option>
            <option value="FALSE">Sold</option>
          </select>
          <select name="Beds" id="Beds" onChange={(e) => setFilterTwo(`homes => homes.beds ${e.target.value}`)}>
            <option value="> 0" defaultValue>Beds</option>
            <option value="=== 4">4</option>
            <option value="=== 5">5</option>
          </select>
          <select name="Baths" id="Baths" onChange={(e) => setFilterThree(`homes => homes.baths ${e.target.value}`)}>
            <option value="> 0" defaultValue>Baths</option>
            <option value="=== '2.0'">2</option>
            <option value="=== '2.5'">2.5</option>
            <option value="=== '3.5'">3.5</option>
          </select>
          <select name="Cost" id="Cost" onChange={(e) => setFilterFour(`homes => homes.cost ${e.target.value}`)}>
            <option value="> 0" defaultValue>Cost</option>
            <option value="=== 1000000">1000000 Matic</option>
            <option value="=== 1100000">1100000 Matic</option>
            <option value="=== 1200000">1200000 Matic</option>
            <option value="=== 1300000">1300000 Matic</option>
          </select>
          <button onClick={resetFilter}>Reset</button>
        </div>

        <div className='numsHomesShown'>Showing {filteredHome.length} Homes</div>
        
        <div className='homeGrid'>
          {filteredHome.map(home => (
            <div key={home.id} className='homeCard'>
              <div className='homeCardTop'>
                <img src={`${home.image}`} alt={`${home.address}`}/>  
                <div className='homeAddress'>
                  <div className='homeAddressStreet'>{home.address}</div>
                  <div>Los Iveros, NV</div>
                </div>
              </div>
              <div className='homeCardBottom'>
                <div className='homeCardStats'>
                  <div className='singleHomeStat'>
                    <div className='singleHomeStatNumber'>{home.beds}</div>
                    <div>Beds</div>
                  </div>
                  <div className='singleHomeStat'>
                    <div className='singleHomeStatNumber'>{home.baths}</div>
                    <div>Baths</div>
                  </div>
                  <div className='singleHomeStat'>
                    <div className='singleHomeStatNumber'>{home.cost}</div>
                    <div>Matic</div>
                  </div>
                </div>
                <div className='homeCardButtonCard'>
                  <a href={home.owned === "FALSE" ? `/purchase/${home.id}`: null}>
                    {home.owned === "FALSE" ? <button className='homeCardButton'>Buy {home.address}</button> : <button className='homeCardButtonSold'>Sold</button>}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>}
    </>
  );
};

export default Home;
