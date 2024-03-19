
import Register from './pages/Register';
import Login from './pages/Login';
import React from 'react';
import Landing from './pages/Landing';
import Gmap from './pages/Home'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
function App() {

  return (

    <Router>
    <Routes>
        {/* Define your routes using 'Route' components */}
        <Route path="/" element={<Gmap />} />
        <Route path="/maps" element={<Gmap />} />
        <Route path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        {/* Add more routes as needed */}
    </Routes>
</Router>

  );
}

export default App;