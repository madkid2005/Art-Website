import React, { useState } from 'react';
import DashboardPNG from "../../assets/images/SellerDashboard.png";

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState('addProduct');
  const [products, setProducts] = useState([]);
 
  const Access = localStorage.getItem("accessBuyer") || "";

  const handlePanelChange = (panel) => {
    setActivePanel(panel);
  };

  const API = async () => {
    if (!Access) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/buyers/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Access}`,
        },
        
      });

      const data = await response.json();
      console.log("Response:", data);
      setProducts(data);

    } catch (error) {
      console.error("Error sending product data:", error);
    }
  };
  API()
  return (
    <div className='container-fluid'>
      <div className="row">
        <div className="col-md-2">
          <div className="d-flex justify-content-center mt-5">
            <div style={{
              border: "1px solid #783dd5",
              borderRadius: "50%"
            }} className="col-md-6">
              <img className="img-fluid p-4" src={DashboardPNG} alt='' />
            </div>
          </div>
          <h5 className='text-center mt-2'>Appino Shop</h5>
          <p className='text-center'>مهدی حسینیان</p>

          <div className="text-center d-flex justify-content-center" onClick={() => handlePanelChange('addProduct')}>
            <i className="bi bi-folder-plus fs-3 "></i>
            <p className='mt-2 mx-2'>اضافه کردن محصول</p>
          </div>

          <div className="text-center d-flex justify-content-center" onClick={() => handlePanelChange('logout')}>
            <i className="bi bi-door-closed fs-3 "></i>
            <p className='mt-2 mx-2'>خروج از حساب</p>
          </div>

          <button className="btn  w-100  rounded-3 text-white" style={{ backgroundColor: "#783dd5" }}> edit data</button>
        </div>

        <div className="col-md-10" style={{ backgroundColor: "#f3f2f8" }}>
          {activePanel === 'addProduct' && (
            <div className='row d-flex'>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
