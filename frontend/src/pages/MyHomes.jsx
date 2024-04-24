import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import { AuthContext } from "../context/authContext";

const MyHomes = () => {
  const [homes, setHomes] = useState([]);
  const { currentUser, login, logout } = useContext(AuthContext);

  console.log(currentUser.username)

  const fetchData = async () => {
    try {
      const res = await axios.post(`http://localhost:8800/api/homes/getUsersHomes`, {
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

  console.log(homes);

  return (      
    <>
    <Navbar />
    <div className='homeGrid'>
      {homes.map(home => (
        <div key={home.id}>
          <img src={`${home.image}`} alt={`${home.address}`}  height={200}/>
          <div>{home.id} - {home.address} - {home.beds} - {home.baths} - {home.cost}</div>
          <a href={`/dashboard/${home.id}`}><button>Access Home Dashboard</button></a>
        </div>
      ))}
    </div>
    </>
  )
}

export default MyHomes