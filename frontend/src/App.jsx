import React from 'react'
import "./css/responsive.css"
import "./css/style.css"
import { ImSpinner8 } from "react-icons/im";
import Login from './pages/Login'
import Navbar from './pages/Navbar'
import Register from './pages/Register'
import { Routes, Route, Navigate } from "react-router-dom";
import { authStore } from './store/auth.store'
import { useEffect } from 'react'
import Home from './pages/Home';
import { Toaster } from "react-hot-toast"
import Profile from './pages/Profile';


const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = authStore();

  useEffect(() => {
    checkAuth();
  }, [])

  return (
    <>
      {
        isCheckingAuth && isCheckingAuth ?
          <div className='loading'>
            <ImSpinner8 className='spinner' />
          </div>
          :
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
              <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
              <Route path='/register' element={authUser ? <Navigate to="/" /> : <Register />} />
              <Route path='/profile' element={!authUser ? <Navigate to="/" /> : <Profile />} />
            </Routes>
            <Toaster position="top-right"
              reverseOrder={false} />
          </>
      }
    </>
  )
}

export default App