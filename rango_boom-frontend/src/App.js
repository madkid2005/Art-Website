import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/store/Navbar';
import Dashboard from './components/Buyer/Dashboard';
import SingtuSeller from './components/Seller/SingupSeller';
import SingupBuyer from './components/Buyer/SingupBuyer';
import Productbestratings from './components/store/Product_bestratings';
import Productlatest from './components/store/Product_latest';
import Productonsale from './components/store/Product_onSale';
import CategoryList from './components/store/CategoryList';
import ProductPage from './components/store/ProductPage';
import BigBanner from './components/store/BigBanner';
import CenterBanner from './components/store/CenterBanner';
import EndBanner from './components/store/EndBanner';
import ProductDatail from './components/store/ProductDatail';
import SellerDashboard from './components/Seller/SellerDashboard';
import Test from './components/Test';

export default function App() {
  const location = useLocation();
  const noHeaderPages = ['/SellerDashboard',"/SingupSeller","/SingupBuyer"]; // به عنوان مثال، هدر در صفحه تماس نمایش داده نشود

  const showHeader = !noHeaderPages.includes(location.pathname);

  return (
    <div style={{ direction: 'rtl' }}>
      {showHeader && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/SingupSeller" element={<SingtuSeller />} />
        <Route path="/SingupBuyer" element={<SingupBuyer />} />
        <Route path="/SellerDashboard" element={<SellerDashboard />} />
        <Route path="/test" element={<Test />} />
        <Route path="/products/category/:id" element={<ProductPage />} />
        <Route path="/products/productdatial/:ID/" element={<ProductDatail />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div>
      <BigBanner />
      <Productonsale />
      <CenterBanner />
      <CategoryList />
      <Productbestratings />
      <EndBanner />
      <Productlatest />
      صفحه اصلی
    </div>
  );
}
