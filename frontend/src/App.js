import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router';
import Signup from './components/signup/Signup';
import { MyProvi, MyCont } from './MyProvi';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Loader from './Loader';

function Wrapper() {
  let { session, setSession, setCurUser, api } = useContext(MyCont);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkServer() {
      try {
        await api.get("/ping");
        setLoading(false)
      } catch (err) {
        setTimeout(checkServer, 5000);
      }
    }
    checkServer();

    const usr = localStorage.getItem("curuser");
    if (usr) {
      setCurUser(JSON.parse(usr));
      setSession(true);
    } else {
      setSession(false);
    }
  }, []);

  if (loading) return <Loader />;

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/dashboard'
          element={session ? <Dashboard /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <MyProvi>
      <Wrapper />
    </MyProvi >
  );
}

export default App;
