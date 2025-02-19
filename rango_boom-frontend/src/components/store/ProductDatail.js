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

    // ADD TO CART
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

        // GET COMMENTS
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
        
        // GET PRODUCT DETAIL
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
            .then(data => console.log(data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, [ID, Access]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    // FORM FOR COMMENT
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
        <div className="container mt-3">
            <div className="row">

                <div className="col-md-3 text-center">
                    <img 
                        src={product.image} 
                        className="img-fluid rounded-4 shadow-sm w-100" 
                        alt={product.name} 
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                    />
                </div>

                {/* Product Details infos */}
                <div className="col-md-5">
                    <h4 className="fw-bold text-black mt-3">{product.name}</h4>
                
                    {/* Custom Features */}
                    <div className="row mt-3">
                        {Object.entries(product.custom_features || {}).map(([key, value], index) => (
                            <div className="col-md-4 col-6 mb-3 mt-2" key={index}>
                                <div className="p-3 rounded-3 text-center shadow-sm bg-light border ">
                                    <strong className="text-secondary">{key}</strong>
                                    <br />
                                    <span className="fw-bold">{value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-3 p-3 rounded-3 border bg-light shadow-sm">
                    {/* Seller info */}
                    <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-shop fs-4 text-success me-2"></i>
                        <span className="fw-bold me-1">فروشنده</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <i className="bi bi-list text-primary me-2"></i>
                        <strong className="me-1">{product.seller_store_name}</strong>
                    </div>
                    <hr />

                    {/* Price Section */}
                    <div className="mt-3">
                        <div className="text-end">قیمت :</div>
                        {product.sale_price ? (
                            <div className="text-start">
                                <span className="fw-bold text-danger fs-5">
                                    {product.formatted_sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </span>
                                <br />
                                <span className="fw-bold text-muted me-2" style={{ textDecoration: "line-through" }}>
                                    {product.formatted_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </span>
                            </div>
                        ) : (
                            <div className="text-end fw-bold fs-5">
                                {product.formatted_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                        )}
                    </div>

                    
                    {/* Stock Availability */}
                    <div className="text-end mt-4">
                        <small className="text-danger fw-bold">تعداد موجودی در انبار: {product.stock}</small>
                    </div>

                    {/* Add To Cart Button */}
                    <button
                        onClick={addToCart}
                        className="btn btn-warning border btn-lg w-100 mt-3"
                        disabled={addingToCart}
                    >
                        {addingToCart ? (
                            <>
                                <i className="bi bi-cart-plus me-2"></i> در حال افزودن...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-cart me-2"></i> افزودن به سبد خرید
                            </>
                        )}
                    </button>

                </div>
            </div>
            
            {/* Product Description */}
            <div className="bg-white p-4 rounded-4 shadow-sm mt-4">
                <h5 className="fw-bold text-center mb-3">توضیحات محصول</h5>
                
                <p className={`text-muted text-center overflow-hidden ${showFull ? "" : "text-truncate"}`} style={{ maxHeight: showFull ? "none" : "3rem" }}>
                    {product.description}
                </p>

                {/* Show More Button */}
                {!showFull && product.description.length > 100 && (
                    <div className="text-center">
                        <button 
                            className="btn btn-light border mt-2" 
                            onClick={() => setShowFull(true)}
                        >
                            مشاهده بیشتر <i className="bi bi-chevron-down"></i>
                        </button>
                    </div>
                )}

                {/* Show Less Button */}
                {showFull && (
                    <div className="text-center">
                        <button 
                            className="btn btn-light border mt-2" 
                            onClick={() => setShowFull(false)}
                        >
                            بستن <i className="bi bi-chevron-up"></i>
                        </button>
                    </div>
                )}
            </div>


            <div className="row mt-4">
                {/* Add Comments */}
                <div className="col-md-4 col-sm-12">
                    <div className="border rounded-4 shadow-sm bg-white p-4">
                        <h5 className="text-center mb-3 fw-bold">دیدگاه کاربران</h5>
                        {message && <p className="text-info text-center">{message}</p>}
                        
                        <form onSubmit={handleFormSubmit}>
                            {/* Star Rating */}
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="fw-bold">امتیاز:</span>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={30}
                                            style={{ cursor: "pointer" }}
                                            color={star <= (hover || rating) ? "#FFD700" : "#ccc"}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Comment Input */}
                            <div className="mb-3">
                                <label className="fw-bold">ثبت دیدگاه:</label>
                                <textarea
                                    className="form-control mt-2"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    rows="3"
                                    placeholder="نظر خود را بنویسید..."
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button className="btn btn-warning btn-lg w-100 mt-3">ثبت</button>
                        </form>
                    </div>
                </div>

                {/* Show Comments */}
                <div className="col-md-8 col-sm-12">
                    <div className="bg-white p-4 rounded-4 shadow-sm">
                        <h5 className="fw-bold mb-3">نظرات کاربران</h5>
                        {ShowComments.length === 0 ? (
                            <p className="text-muted text-center">هنوز نظری ثبت نشده است.</p>
                        ) : (
                            ShowComments.map((ShowComment, index) => (
                                <div key={index} className="border-bottom pb-3 mb-3">
                                    {/* Stars */}
                                    <div className="d-flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={`bi bi-star${star <= ShowComment.rating ? '-fill' : ''} fs-5 text-warning me-1`}
                                            ></i>
                                        ))}
                                    </div>
                                    
                                    {/* Comment Text */}
                                    <p className="mt-2 text-muted">{ShowComment.comment}</p>

                                    {/* Buyer Name */}
                                    <small className="text-secondary fw-bold"> توسط {ShowComment.buyer_name} {ShowComment.buyer_family_name} </small>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}