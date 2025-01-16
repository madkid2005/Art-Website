import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

export default function App() {
  return (
    <div style={{ direction: 'rtl' }}>
      <Router> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

function Home() {
  return <div>صفحه اصلی</div>;
}
