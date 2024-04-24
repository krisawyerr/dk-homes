import axios from "axios";
import { createContext, useEffect, useState } from "react";

import { ethers } from "ethers"

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || null));

    const login = async() => {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const res = await axios.post("http://localhost:8800/api/auth/authenticate", {
            username: account,
            password: account,
        });
        setCurrentUser(res.data)
    }

    const logout = async(input) => {
        const res = await axios.post("http://localhost:8800/api/auth/logout");
        setCurrentUser(null)
        setCurrentAccount(null)
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
}