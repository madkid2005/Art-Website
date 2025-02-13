import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const Access = localStorage.getItem("accessBuyer") || "";

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            headers: { "Authorization": `Bearer ${Access}` }
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.detail) {
                setError(data.detail);
            } else {
                setCartItems(data.items || []);
            }
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching cart:", err);
            setError("Failed to load cart.");
            setLoading(false);
        });
    }, [Access]);

    const handleOrderPlacement = () => {
        if (!address.trim()) {
            alert("Please enter a valid address.");
            return;
        }
    
        fetch("http://127.0.0.1:8000/api/orders/place-order/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${Access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: address,  // Ensure address is sent
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }
            alert("Order placed successfully!");
            navigate("/orders");
        })
        .catch((err) => {
            console.error("Error placing order:", err);
            alert("Failed to place order. Please try again.");
        });
    };
    

    if (loading) return <div>Loading checkout details...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Checkout</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <h4>Order Summary</h4>
                    <ul className="list-group mb-3">
                        {cartItems.map((item) => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between">
                                <span>{item.product_name} (x{item.quantity})</span>
                                <span>${(item.quantity * item.product_price).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <h4>Total: ${cartItems.reduce((total, item) => total + (item.quantity * item.product_price), 0).toFixed(2)}</h4>
                    
                    <div className="mt-3">
                        <label className="form-label">Shipping Address</label>
                        <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    <button className="btn btn-primary mt-3" onClick={handleOrderPlacement}>
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
}
