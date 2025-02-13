import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuyerProfile() {
  const [buyerProfile, setBuyerProfile] = useState({
    name: "",
    address: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const Access = localStorage.getItem("accessBuyer") || "";

  useEffect(() => {
    fetchBuyerProfile();
    fetchOrders();
  }, []);

  const fetchBuyerProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/buyers/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Access}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBuyerProfile({
          name: data.name || "",
          address: data.address || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
        });
      } else {
        setError("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching buyer profile:", error);
      setError("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/buyers/orders/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Access}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders");
    }
  };

  const handleChange = (e) => {
    setBuyerProfile({ ...buyerProfile, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/buyers/profile/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${Access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buyerProfile),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Error updating profile: " + (data.name?.[0] || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Buyer Profile</h2>
      <form onSubmit={updateProfile}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={buyerProfile.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address:</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={buyerProfile.address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={buyerProfile.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            className="form-control"
            value={buyerProfile.phone_number}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>

      <h3 className="mt-4">Your Orders</h3>
      <ul>
        {orders.length ? (
          orders.map((order) => (
            <li key={order.id}>
              {order.product_name} - {order.status} - {order.created_at}
            </li>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </ul>
    </div>
  );
}
