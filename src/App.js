import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/home';
import Login from './auth/login';
import SignIn from './auth/signin';
import HomeT from './teacher/home';
import Scan from './teacher/scan';
import Class from './teacher/class';
import Pro from './teacher/projects';
import HomeS from './student/home';
import Note from './student/notes';
import Qr from './student/ceateQr';
import QrL from './student/qrList';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/teacher" element={<HomeT />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/project" element={<Pro />} />
        <Route path="/class" element={<Class />} />
        <Route path="/student" element={<HomeS />} />
        <Route path="/qr" element={<Qr />} />
        <Route path="/list" element={<QrL />} />
        <Route path="/note" element={<Note />} />
      </Routes>
    </Router>
  );
}

export default App;
