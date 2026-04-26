import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from './pages/Welcome'
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Feedpage from './pages/Feedpage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
     <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feedpage/>} />
        <Route path="/upload" element={<UploadPage/>} />
    
      </Routes>
    </BrowserRouter>
  )
}

export default App