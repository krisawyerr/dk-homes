import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currentUser, login, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false)

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
    <div className='nav'>
      <div className='navbar'>
        <a href="/" className='LogaA'><img src="/dkhomeslogo.png" alt="dk homes"/></a>
        <div className='navRight'>
          <div className='navTopRowContainer'>
            <div className='navTopRow'>
              <a href="/"><button className='navTopRowButton'>Find a Home</button></a>
              <a href="/myhomes"><button className='navTopRowButton'>My Homes</button></a>
              {!currentUser ? <button onClick={handleLogin} className='metamask'>Connect Metamask</button> : <button onClick={logout} className='metamask'>Logout</button>}
            </div>
          </div>
          <div className='navBottomRow'>
            <div>Built on Relationships</div>
            <div>Buy a Home Today!</div>
          </div>
        </div>
        <div className='navMenu'>
          {!menuOpen && <img src="/menu.svg" alt="menu" onClick={() => setMenuOpen(true)}/>}
          {menuOpen && <img src="/x.svg" alt="menu" onClick={() => setMenuOpen(false)}/>}
        </div>
      </div>
      {menuOpen && <div className='menuBody'>
        <a href="/"><button className='menuBodyButton'>Find a Home</button></a>
        <a href="/myhomes"><button className='menuBodyButton'>My Homes</button></a>
        {!currentUser ? <button onClick={handleLogin} className='metamask'>Connect Metamask</button> : <button onClick={logout} className='metamask'>Logout</button>}
      </div>}
    </div>
    </>
  )
}

export default Navbar