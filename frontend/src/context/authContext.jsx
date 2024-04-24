import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || null));
    const [currentAccount, setCurrentAccount] = useState(JSON.parse(localStorage.getItem("account") || null));

    const login = async(username, password, account) => {
        const res = await axios.post("http://localhost:8800/api/auth/authenticate", {
            username,
            password,
        });
        setCurrentUser(res.data)
        setCurrentAccount(account)
    }

    const logout = async(input) => {
        const res = await axios.post("http://localhost:8800/api/auth/logout");
        setCurrentUser(null)
        setCurrentAccount(null)
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser])

    useEffect(() => {
        localStorage.setItem("account", JSON.stringify(currentAccount))
    }, [currentAccount])

    return (
        <AuthContext.Provider value={{ currentUser, currentAccount, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
}