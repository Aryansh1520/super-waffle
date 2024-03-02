import "./index.css";
import Register from './pages/Register';
import Login from './pages/Login';
import Oome from './pages/Home';
import React from 'react'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
function App() {

  return (
    <Router>
    <Routes>
        {/* Define your routes using 'Route' components */}
        <Route path="/oome" element={<Oome />} />
        <Route path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        {/* Add more routes as needed */}
    </Routes>
</Router>
  );
}

export default App;