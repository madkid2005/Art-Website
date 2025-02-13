import React, { useEffect, useState } from 'react';

export default function CartItems() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const accessToken = localStorage.getItem("accessBuyer") || "";

    // Fetch Cart Data
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setCart(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching cart:", err);
            setError("Failed to load cart.");
            setLoading(false);
        });
    }, []);

    // Update Quantity in Cart
    const updateCartItem = (cartItemId, newQuantity) => {
        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cart_item_id: cartItemId, quantity: newQuantity })
        })
        .then(res => {
            if (res.status === 204) return null; // Item removed
            return res.json();
        })
        .then(() => {
            setCart(prevCart => {
                const updatedItems = prevCart.items.map(item =>
                    item.id === cartItemId ? { ...item, quantity: newQuantity } : item
                ).filter(item => item.quantity > 0);
                return { ...prevCart, items: updatedItems };
            });
        })
        .catch(err => console.error("Error updating cart:", err));
    };

    // Remove Item from Cart
    const removeItem = (cartItemId) => {
        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cart_item_id: cartItemId })
        })
        .then(() => {
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.filter(item => item.id !== cartItemId)
            }));
        })
        .catch(err => console.error("Error removing item:", err));
    };

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p>{error}</p>;
    if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

    return (
        <div className="container mt-4">
            <h2>Your Cart</h2>
            <div className="row">
                {cart.items.map(item => (
                    <div key={item.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={item.product_image} className="card-img-top" alt={item.product_name} />
                            <div className="card-body">
                                <h5 className="card-title">{item.product_name}</h5>
                                <p className="card-text">Price: ${item.product_price}</p>
                                <p className="card-text">Quantity: {item.quantity}</p>
                                <div className="d-flex">
                                    <button className="btn btn-secondary" onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</button>
                                    <button className="btn btn-primary mx-2" onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
                                    <button className="btn btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
