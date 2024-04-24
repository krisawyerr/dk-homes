import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currentUser, login, logout } = useContext(AuthContext);

  async function handleLogin() {
    try {
      await login()
    } catch (err) {
      setErr(err.response.data);
    }
  }

  return (
    <div className='navbar'>
      <div>DK Home</div>
      {!currentUser ? <button onClick={handleLogin}>Connect Metamask</button> : <button onClick={logout}>Logout</button>}
    </div>
  )
}

export default Navbar