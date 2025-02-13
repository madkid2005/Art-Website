import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/orders/orders/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders");
      }
    };
    fetchOrders();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <div>{order.product_name}</div>
              <div>Status: {order.status}</div>
              <div>Address: {order.address}</div>
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
