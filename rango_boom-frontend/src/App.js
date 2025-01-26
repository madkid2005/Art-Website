import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SingtuSeller from './components/SingupSeller';
import SingupBuyer from './components/SingupBuyer';
import Product from './components/Product';

export default function App() {
  return (
    <div style={{ direction: 'rtl' }}>
      <Router> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/SingupSeller" element={<SingtuSeller />} />
          <Route path="/SingupBuyer" element={<SingupBuyer />} />
        </Routes>
      </Router>
    </div>
  );
}

function Home() {
  return <div>
  <Product/>
  صفحه اصلی</div>;
}
