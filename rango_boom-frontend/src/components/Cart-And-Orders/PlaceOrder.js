import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders/place-order/",
        { address },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 201) {
        navigate("/orders");
      }
    } catch (err) {
      setError("Failed to place order");
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      {error && <div>{error}</div>}
      <textarea
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default PlaceOrder;
