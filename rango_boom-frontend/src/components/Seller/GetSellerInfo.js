import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "@/components/ui";

const Dashboard = () => {
  const [seller, setSeller] = useState({
    name: "",
    phone: "",
    shop_name: ""
  });
  const [product, setProduct] = useState({
    title: "",
    price: "",
    category: ""
  });

  useEffect(() => {
    // Retrieve seller information from local storage
    const storedSeller = JSON.parse(localStorage.getItem("seller"));
    if (storedSeller) {
      setSeller(storedSeller);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleAddProduct = () => {
    const productData = {
      ...product,
      seller_name: seller.name,
      seller_phone: seller.phone,
      seller_shop_name: seller.shop_name
    };
    console.log("Adding Product: ", productData);
    // API call to add product
  };

  return (
    <div className="dashboard">
      <h2>Seller Dashboard</h2>
      <div className="seller-info">
        <p><strong>Name:</strong> {seller.name}</p>
        <p><strong>Phone:</strong> {seller.phone}</p>
        <p><strong>Shop Name:</strong> {seller.shop_name}</p>
      </div>
      <div className="product-form">
        <Input
          name="title"
          placeholder="Product Title"
          value={product.title}
          onChange={handleInputChange}
        />
        <Input
          name="price"
          placeholder="Product Price"
          value={product.price}
          onChange={handleInputChange}
        />
        <Select
          name="category"
          value={product.category}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
        </Select>
        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>
    </div>
  );
};

export default Dashboard;
