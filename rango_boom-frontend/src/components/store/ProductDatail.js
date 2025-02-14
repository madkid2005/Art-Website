import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/ProductDetail.css';
import { FaStar } from 'react-icons/fa';

export default function ProductDetail() {
    const { ID } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const [ShowComments, setShowComments] = useState([]);
    const [hover, setHover] = useState(0);
    const words = product?.description ? product.description.split(" ") : [];

    const [showFull, setShowFull] = useState(false); // کنترل نمایش متن کامل
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
            // GET COMMENT

            fetch(`http://127.0.0.1:8000/api/store/products/${ID}/reviews/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Access}`,
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then(data => {
                    setShowComments(data);
                })
                .catch(error => console.error("Error fetching reviews:", error));
    
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

        // Fetch comments after product is loaded
        fetch(`http://127.0.0.1:8000/api/store/products/${ID}/reviews/`, {
            headers: {
                Authorization: `Bearer ${Access}`,
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => console(data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, [ID, Access]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            setMessage("لطفاً امتیاز خود را انتخاب کنید.");
            return;
        }
        handleSubmit(e);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Access) {
            setMessage("لطفاً ابتدا وارد حساب کاربری خود شوید.");
            return;
        }

        const reviewData = {
            rating,
            comment,
            product: ID,
            buyer: "ss", // in a real application, replace with logged-in user id
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

            if (!response.ok) {
                throw new Error(data.detail || "مشکلی در ارسال نظر وجود دارد");
            }

            setMessage("نظر شما با موفقیت ثبت شد!");
            setRating(5);
            setComment("");

            // Refresh comments after submission
            setShowComments(prevComments => [...prevComments, data]);
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
                                    className="col-md-4 mb-1 rounded-3 gap-2 text-center p-3 rounded"
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
                        <span><i className="bi bi-shop fs-5 text-success p-3"></i></span>
                        فروشنده
                    </span>
                    <br />
                    <strong className='me-3'><i class="bi bi-list text-primary me-3 ms-1"></i>{product.seller_store_name}</strong>
                    <br />
                    <hr />
                    <p className="text-start mt-3">
                        <span className='fw-bold'>
                            {product.formatted_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                    </p>
                    <div className="text-center">
                        <br></br>
                        <small className="text-danger fw-bold">تعداد موجودی در انبار {product.stock}</small>
                    </div>
                    <div className="product-actions">
                        <button
                            onClick={addToCart}
                            className="btn btn-warning mt-1 mb-3 border btn-lg w-100"
                            disabled={addingToCart}
                        >
                          <small>
                            {addingToCart ? 'Adding to Cart...' : 'افزودن به سبدخرید'}
                          </small>
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <h4>توضیحات:</h4>
                <p className="product-description">
                    {showFull ? product.description : words.slice(0, 30).join(" ") + "..." }
                </p>
                {!showFull && words.length > 30 && (
                    <button
                        className="mt-2 px-3 py-1 btn "
                        onClick={() => setShowFull(true)}
                    >
                        <i className="bi bi-arrow-bar-down fs-4"></i>
                    </button>
                )}
            </div>

            <div className="row mt-4">
                <div className="col-md-3 col-sm-12">
                    <div className="border rounded-4">
                        <div className="p-3">
                            <h5 className='mt-2'>دیدگاه کاربران</h5>
                            {message && <p className="text-info">{message}</p>}
                            <form onSubmit={handleFormSubmit} className=''>
                                <div className="d-flex">
                                    <span className='mt-3'>امتیاز:</span>
                                    <div className="star-rating mt-3 me-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                size={25}
                                                style={{ cursor: "pointer" }}
                                                color={star <= (hover || rating) ? "#FFD700" : "#ccc"}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(null)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <label className='mt-2'>نظر شما:</label>
                                <input
                                    className="review-input"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                                <button className="review-btn" type="submit">ارسال نظر</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-md-8">
                    {ShowComments.map((ShowComment, index) => (
                        <div key={index} className="comment-item">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={`bi bi-star${star <= ShowComment.rating ? '-fill' : ''} fs-4 text-warning`}
                                    ></i>
                                ))}
                            </div>
                            <p className="comment-text">{ShowComment.comment}</p>
                            <p className="comment-user">By {ShowComment.buyer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}