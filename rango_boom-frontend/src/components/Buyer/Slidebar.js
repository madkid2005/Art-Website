import React, { useState, useEffect } from 'react';  // Make sure hooks are imported
import './css/Slidebar.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Sidebar = () => {
  const Access = localStorage.getItem("accessBuyer") || "";
  const navigate = useNavigate(); // Initialize the navigate function from React Router

  // Move useState and useEffect inside the functional component
  const [showprofile, setShowprofile] = useState({
    name: "",
    family_name: '',
    email: "",
    address: "",
    phone_number: "",
  });

  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    // Fetch user profile
    fetch("http://127.0.0.1:8000/api/buyers/profile/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Access}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setShowprofile(data))
      .catch((error) => console.error("Error:", error));
  }, [Access]); // Dependency on `Access` value, to refetch when it changes

  const handleEdit = (field, value) => {
    setEditField(field);
    setTempValue(value);
  };

  const handleUpdate = () => {
    const updatedProfile = { ...showprofile, [editField]: tempValue };

    fetch("http://127.0.0.1:8000/api/buyers/profile/", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then(() => {
        setShowprofile(updatedProfile);
        setEditField(null);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("accessBuyer");
    // Redirect the user to the login page (or home page)
    navigate("/SignupBuyer"); 
  };
  
  return (
    <div className="sidebar me-3 ms-3">
      <div className="sidebar-header">
        <p>{showprofile.name} {showprofile.family_name}</p>
        <p>{showprofile.phone_number}</p>
      </div>
      <div className="sidebar-menu">
        <ul>
          <li className="menu-item">
          <Link to="/account-info">اطلاعات حساب کاربری</Link>
          </li>

          <li className="menu-item">
            <span>سفارش‌ها</span>
          </li>

          <li className="menu-item">
            <span>لیست‌های من</span>
          </li>
          
          <li className="menu-item">
            <span>آدرس‌ها</span>
          </li>
          
          <li className="menu-item">
            <span>پیام‌ها</span>
          </li>
          <li className="menu-item">
            <span>بازدیدهای اخیر</span>
          </li>
          
          <li className="menu-item">
            <span onClick={handleLogout} style={{ cursor: 'pointer', color: 'red' }}>
              خروج
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
