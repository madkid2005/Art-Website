import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("accessBuyer");

      // If no token is found, handle the error
      if (!token) {
        setError("You are not logged in. Please log in to view your orders.");
        return;
      }

      try {
        // Fetch orders with authorization header
        const response = await axios.get("http://127.0.0.1:8000/api/orders/orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        // Handle errors from API response
        if (err.response && err.response.status === 401) {
          setError("Unauthorized access. Please log in again.");
        } else {
          setError("Failed to load orders. Please try again later.");
        }
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this runs once after the first render

  // If there's an error, display it
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <div>Product: {order.product_name}</div>
              <div>Status: {order.status}</div>
              <div>Address: {order.address}</div>

              <div className="mt-3"></div>
              <div>tedad: {order.quantity}</div>
              <div>phone number: {order.buyer_phone}</div>
              <div>jame faktor: {order.total_price}</div>
              <div>tarikh va saaat: {order.created_at}</div>


            </li>
          ))}
        </ul>
      ) : (
        <div>No orders found.</div>
      )}
    </div>
  );
};

export default OrderStatus;
