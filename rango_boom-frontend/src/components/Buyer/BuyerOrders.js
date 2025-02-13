import React, { useEffect, useState } from "react";

function BuyerOrders({ accessToken }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/buyers/orders/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("خطا در دریافت سفارشات");
      }
    };

    fetchOrders();
  }, [accessToken]);

  return (
    <div>
      <h3 className="mt-4">سفارش‌های شما</h3>
      {error && <p className="text-danger">{error}</p>}
      <ul>
        {orders.length ? (
          orders.map((order) => (
            <li key={order.id}>
              {order.product_name} - {order.status} - {order.created_at}
            </li>
          ))
        ) : (
          <p>هیچ سفارشی یافت نشد</p>
        )}
      </ul>
    </div>
  );
}

export default BuyerOrders;
