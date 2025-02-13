import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/ProductDetail.css';

export default function ProductDetail() {
    const { ID } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");

    const Access = localStorage.getItem("accessBuyer") || "";

    const addToCart = () => {
        if (!Access) {
            alert("Please log in to add items to the cart.");
            return;
        }

        setAddingToCart(true);

        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${Access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_id: product.id,
                quantity: 1,
            }),
        })
            .then(res => res.json())
            .then(cartData => {
                setAddingToCart(false);
                if (cartData.detail) {
                    alert(cartData.detail);
                } else {
                    alert('Product added to cart successfully!');
                }
            })
            .catch(error => {
                console.error("Error adding to cart:", error);
                setAddingToCart(false);
                alert('Failed to add product to cart.');
            });
    };

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/store/products/${ID}/`)
            .then(res => res.json())
            .then(data => {
                if (data.detail) {
                    setError('Product not found.');
                } else {
                    setProduct(data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                setError('Error fetching product.');
                setLoading(false);
            });
    }, [ID]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Access) {
            setMessage("لطفاً ابتدا وارد حساب کاربری خود شوید.");
            return;
        }

        const reviewData = {
            rating, // عدد بین ۱ تا ۵
            comment, // متن نظر
        product:ID,
        buyer:"ss",
        };


        try {
            const response = await fetch(`http://127.0.0.1:8000/api/store/products/${ID}/reviews/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Access}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });

            const data = await response.json();
            console.log('Review Response:', data);
            console.log('====================================');
            console.log(data);
            console.log('====================================');

            if (!response.ok) {
                throw new Error(data.detail || "مشکلی در ارسال نظر وجود دارد");
            }

            setMessage("نظر شما با موفقیت ثبت شد!");
            setRating(5);
            setComment("");
        } catch (error) {
            console.error("Error:", error);
            setMessage("خطایی رخ داد، لطفاً دوباره امتحان کنید.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                    <img src={product.image} className="img-fluid rounded-3" alt={product.name} />
                </div>
                <div className="col-md-5">
                    <div className="product-info">
                        <h5>{product.name}</h5>
                        <div className="row mt-5">
                            {Object.entries(product.custom_features || {}).map(([key, value], index) => (
                                <div
                                    className="col-md-4 mb-1 text-center p-3 rounded"
                                    key={index}
                                    style={{
                                        backgroundColor: "#f6f6f6",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                    }}
                                >
                                    <strong>{key}</strong>: {value}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-3 rounded-3 border" style={{ backgroundColor: "#f6f6f6" }}>
                    <span className='fw-bold'>
                        <br />
                        <span><i className="bi bi-shop fs-4 text-success p-2"></i></span>
                        فروشنده
                    </span>
                    <br />
                    <strong className='me-5'>{product.seller_store_name}</strong>
                    <br />
                    <hr />
                    <p className="text-start mt-3">
                        <span className='fw-bold'>
                            {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                        <span className='font-Homa mx-2'>تومان</span>
                    </p>
                    <div className="text-center">
                        <small className="text-danger fw-bold">تعداد موجودی در انبار {product.stock}</small>
                    </div>
                    <div className="product-actions">
                        <button
                            onClick={addToCart}
                            className="btnrgb border btn-lg w-100"
                            disabled={addingToCart}
                        >
                            {addingToCart ? 'Adding to Cart...' : 'اضافه کردن به سبد خرید'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h4>توضیحات:</h4>
                <p className="product-description">{product.description}</p>
            </div>
            <div className="row mt-4">
                <div>
                    <h3>ثبت نظر</h3>
                    {message && <p className="text-info">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <label>امتیاز (۱ تا ۵):</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                        />
                        <br />
                        <label>نظر شما:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                        <br />
                        <button type="submit">ارسال نظر</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
