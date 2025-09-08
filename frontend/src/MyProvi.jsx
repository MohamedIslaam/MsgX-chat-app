import { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router';

export let MyCont = createContext();

export let MyProvi = ({ children }) => {
    const URL = "https://msgx.onrender.com";
    const api = axios.create({ baseURL: URL });
    const navi = useNavigate();
    let [curUser, setCurUser] = useState('');
    let [chatList, setChatList] = useState([]);
    let [search, setSearch] = useState('');
    let [session, setSession] = useState(false);
    return (
        <MyCont.Provider value={{
            api, navi, curUser, setCurUser,
            chatList, setChatList, search, setSearch,
            session, setSession
        }}>
            {children}
        </MyCont.Provider>
    )
}