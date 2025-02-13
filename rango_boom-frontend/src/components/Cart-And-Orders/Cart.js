import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("accessBuyer") || "";

    // Fetch Cart Data
    useEffect(() => {
        if (!accessToken) {
            alert("Please log in to view your cart.");
            navigate("/login");
            return;
        }

        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            headers: { "Authorization": `Bearer ${accessToken}` },
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
    }, [accessToken, navigate]);

    // Update Quantity in Cart
    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(cartItemId);
            return;
        }

        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cart_item_id: cartItemId,
                quantity: newQuantity,
            }),
        })
        .then(res => res.json())
        .then(() => {
            setCartItems(prevItems => prevItems.map(item => 
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            ));
        })
        .catch(err => {
            console.error("Error updating cart:", err);
            alert("Failed to update quantity.");
        });
    };

    // Remove Item from Cart
    const removeFromCart = (cartItemId) => {
        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cart_item_id: cartItemId }),
        })
        .then(() => {
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
        })
        .catch(err => {
            console.error("Error removing item:", err);
            alert("Failed to remove item.");
        });
    };

    // Handle Checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        navigate("/checkout");
      };

    if (loading) return <div className="loading">Loading cart...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
            ) : (
                <div className="row">
                    <div className="col-md-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item d-flex align-items-center shadow p-3 mb-3 bg-white rounded">
                                <img src={item.product_image} alt={item.product_name} className="cart-item-img me-3" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                                <div className="flex-grow-1">
                                    <h5>{item.product_name}</h5>
                                    <p className="text-muted">Price: ${item.product_price}</p>
                                    <div className="d-flex align-items-center">
                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border rounded shadow bg-light">
                            <h4>Total: ${cartItems.reduce((total, item) => total + item.product_price * item.quantity, 0).toFixed(2)}</h4>
                            <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
