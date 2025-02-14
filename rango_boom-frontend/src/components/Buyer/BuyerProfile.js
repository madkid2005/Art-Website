import React, { useEffect, useState } from "react";
import Sidebar from './Slidebar';  

export default function Dashboard() {
  const Access = localStorage.getItem("accessBuyer") || "";
  const [showprofile, setShowprofile] = useState({
    name: "",
    family_name: '',
    email: "",
    address: "",
    phone_number: "",
    zip_code : "",
    age: "",
    meli_code: "",
  });
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");


  useEffect(() => {
    // دریافت پروفایل کاربر
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

  }, []);

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

  

  return (
    
    <div className="container mt-4">
      
      <div className="row justify-content-start">
      <Sidebar />
      </div>

    </div>
    
  );
}
