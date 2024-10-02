import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Registrasi from './components/Registrasi';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Transaction from './components/Transaction';

function App() {
  const location = useLocation();

  const showNavbar = !(location.pathname === '/' || location.pathname === '/register');

  const [transactionData, setTransactionData] = useState({
    item: 'Laptop',
    price: 7000000,
    date: '2024-10-02',
    status: 'Completed',
  });

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registrasi />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transactions" element={<Transaction transactionData={transactionData}/>} />
      </Routes>
    </>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
