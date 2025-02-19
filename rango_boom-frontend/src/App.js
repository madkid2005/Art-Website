import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/store/Navbar';
import CategoryList from './components/store/CategoryList';

// Banner
import BigBanner from './components/store/BigBanner';
import CenterBanner from './components/store/CenterBanner';
import EndBanner from './components/store/EndBanner';

// Products
import Productbestratings from './components/store/Product_bestratings';
import Productlatest from './components/store/Product_latest';
import Productonsale from './components/store/Product_onSale';
import ProductPage from './components/store/ProductPage';
import ProductDatail from './components/store/ProductDatail';

// Seller
import SingtuSeller from './components/Seller/SingupSeller';
import SellerDashboard from './components/Seller/SellerDashboard';
import AddProduct from './components/Seller/AddProduct';

// Buyer
import SingupBuyer from './components/Buyer/SingupBuyer';
import BuyerProfile from './components/Buyer/BuyerProfile';
import BuyerOrders from './components/Buyer/BuyerOrders';
import AccountInfo from './components/Buyer/AccountInfo';


// Orders 
import Cart from "./components/Cart-And-Orders/Cart";
import Checkout from "./components/Cart-And-Orders/Checkout";
import OrderStatus from "./components/Cart-And-Orders/OrderStatus";


export default function App() {
  const location = useLocation();
  const noHeaderPages = ['/SellerDashboard',"/SingupSeller","/SingupBuyer"]; // به عنوان مثال، هدر در صفحه تماس نمایش داده نشود

  const showHeader = !noHeaderPages.includes(location.pathname);

  return (
    <div style={{ direction: 'rtl' }}>
      {showHeader && <Navbar />}
      <Routes>

        {/* Products List Page */}
        <Route path="/" element={<Home />} />
        {/* Category */}
        <Route path="/products/category/:id" element={<ProductPage />} />
        {/* Product detail page */}
        <Route path="/products/productdatial/:ID/" element={<ProductDatail />} />


        {/* Seller signup */}
        <Route path="/SingupSeller" element={<SingtuSeller />} />
        {/* Seller Dashboard */}
        <Route path="/SellerDashboard" element={<SellerDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />


        {/* Buyer Dashborad */}
        <Route path="/BuyerProfile" element={<BuyerProfile />} />
        <Route path="/buyer-orders" element={<BuyerOrders />} />
        <Route path="/account-info" element={<AccountInfo />} />
        {/* Buyer signup */}
        <Route path="/SingupBuyer" element={<SingupBuyer />} />
        {/* orders status  */}
        <Route path="/orders" element={<OrderStatus />} />



        {/* cart iteams */}
        <Route path="/cart" element={<Cart />} />
        {/* checkout : after cart and click on checkout (PlaceOrder) */}
        <Route path="/checkout" element={<Checkout />} />

        

        

      
      </Routes>
    </div>
  );
}

// Order of main page parts 
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
