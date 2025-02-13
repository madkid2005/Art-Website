import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/orders/cart/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setCart(response.data);
      } catch (err) {
        setError("Failed to load cart");
      }
    };
    fetchCart();
  }, []);

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(
        "http://127.0.0.1:8000/api/orders/cart/",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          data: { cart_item_id: cartItemId },
        }
      );
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.id !== cartItemId),
      }));
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cart ? (
        <div>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                <span>{item.product_name} - {item.quantity}</span>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/place-order")}>Proceed to Checkout</button>
        </div>
      ) : (
        <div>Loading cart...</div>
      )}
    </div>
  );
};

export default Cart;
