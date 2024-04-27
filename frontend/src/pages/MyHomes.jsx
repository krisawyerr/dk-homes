import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import { AuthContext } from "../context/authContext";

const MyHomes = () => {
  const [homes, setHomes] = useState([]);
  const { currentUser, login, logout } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_LINK}/api/homes/getUsersHomes`, {
        id: currentUser.username,
      });
      setHomes(res.data);
    } catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function handleLogin() {
    try {
      await login()
      window.location.reload();
    } catch (err) {
      setErr(err.response.data);
    }
  }

  return (      
    <>
    <Navbar />
    {!homes && <Loader />}
    {homes && <div className='mainBody'>
      {currentUser && <div className='homeGrid'>
        {homes.map(home => (
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
                <a href={`/dashboard/${home.id}`}>
                  <button className='homeCardButton'>Access Home Dashboard</button>
                </a>
              </div>
            </div>
          </div>
        ))}
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

export default MyHomes