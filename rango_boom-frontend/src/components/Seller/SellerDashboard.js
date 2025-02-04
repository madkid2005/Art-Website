import React, { useState } from 'react';
import DashboardPNG from "../../assets/images/SellerDashboard.png";
import "./css/ProductForm.css";

export default function SellerDashboard() {
  const [activePanel, setActivePanel] = useState('addProduct');
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [seller, setSeller] = useState('');
  const [slug, setSlug] = useState('');
  const [stock, setStock] = useState('');
  const [category_id, setCategory_id] = useState('');

  const Access = localStorage.getItem("accessBuyer") || "";

  const handlePanelChange = (panel) => {
    setActivePanel(panel);
  };

  const APISENDCRATEPRODUCT = async () => {
    if (!Access) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/sellers/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Access}`,
        },
       body: JSON.stringify({
  description,
  name,
  price,
  seller: Number(seller),
  slug,
  stock,
  category_id,
  image: 'https://www.chess.com/bundles/web/images/sprites/navsprite.fe042891.png'  // مسیر تصویر مورد نظر را وارد کنید
}),

      });

      const data = await response.json();
      console.log("Response:", data);
      setProducts(data);

    } catch (error) {
      console.error("Error sending product data:", error);
    }
  };

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
              <h3 className="title">پنل اضافه کردن محصول</h3>
              <form onSubmit={(e) => { e.preventDefault(); APISENDCRATEPRODUCT(); }}>
                <div className="row">
                  <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                </div>

                <div className="row">
                  <div className="input-group">
                    <label htmlFor="seller">Seller</label>
                    <input type="text" id="seller" value={seller} onChange={(e) => setSeller(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="slug">Slug</label>
                    <input type="text" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="stock">Stock</label>
                    <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="stock">category_id</label>
                    <input type="number" id="stock" value={category_id} onChange={(e) => setCategory_id(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="submit-btn">Submit</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
