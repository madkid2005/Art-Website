import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/ProductDetail.css'; // اضافه کردن فایل CSS برای استایل‌ها

export default function ProductDetail() {
    const { ID } = useParams();
    const [product, setProduct] = useState(null); // برای ذخیره داده‌ها
    const [loading, setLoading] = useState(true); // برای وضعیت بارگذاری
    const [error, setError] = useState(null); // برای ذخیره خطاها
    const [addingToCart, setAddingToCart] = useState(false); // وضعیت اضافه کردن به سبد خرید
    const [userComment, setUserComment] = useState("11");
    const [ userRating , setUserRating] = useState(2)

    const Access = localStorage.getItem("accessBuyer") || "";

    const addToCart = () => {
        if (!Access) {
            console.error("No access token found");
            return;
        }
    
        setAddingToCart(true); // Start adding to cart
    
        console.log("Adding product to cart with ID:", product.id); // Log product ID to ensure it's correct
    
        fetch("http://127.0.0.1:8000/api/orders/cart/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Access}`,
            },
            body: JSON.stringify({
                product_id: product.id, // Use product_id as expected in the backend
                quantity: 1, // Default quantity 1
            }),
        })
        .then(res => res.json())
        .then(data => {
            console.log('Product added to cart:', data);
            setAddingToCart(false); // End adding to cart
            if (data.detail) {
                alert(data.detail); // Show any error messages from the backend
            } else {
                alert('Product added to cart successfully!');
            }
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            setAddingToCart(false); // End adding to cart even if there's an error
            alert('Failed to add product to cart.');
        });
    };

    const SendComment = ()=>{
        fetch(`http://127.0.0.1:8000/api/store/products/${ID}/reviews/`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Access}`,
            },
            body:JSON.stringify({ comment: userComment,  // مقدار کامنت از ورودی کاربر
                product: ID,           // شناسه محصول
                rating: userRating})
        })
        .then(res => res.json())
        .then(data =>{
            console.log('====================================');
            console.log(data);
            console.log('====================================');
        } )
    }
    

    useEffect(() => {
    SendComment()

        console.log('Fetching product with ID:', ID); // چاپ ID برای بررسی بیشتر

        fetch(`http://127.0.0.1:8000/api/store/products/${ID}/`)
            .then(res => res.json())
            .then(data => {
                console.log('Product data:', data); // چاپ داده‌های دریافتی از API

                if (data.detail && data.detail === 'Not found.') {
                    setError('Product not found.'); // نمایش پیام خطا در صورت عدم یافتن محصول
                } else {
                    setProduct(data); // ذخیره داده‌ها در state
                }
                setLoading(false); // تغییر وضعیت بارگذاری
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                setError('Error fetching product.'); // نمایش پیام خطا در صورت بروز خطا
                setLoading(false);
            });
    }, [ID]);

  
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>; // نمایش پیام خطا در صورت بروز مشکل
    }

    if (!product) {
        return <div className="not-found">Product not found.</div>; // در صورتی که محصول پیدا نشد
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 justify-content-center mt-2 shadow rounded-3 d-flex">
                    <div className="col-md-6 text-center">
                        <div className="text-center col-md-6">
                            <img src={product.image} className='w-100' alt={product.name} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="product-info">
                            <h1 className="product-title">{product.name}</h1>
                            <p className="product-description">{product.description}</p>
                            <p className="product-price">Price: ${product.price}</p>
                            <p className="product-price">Seller: {product.seller}</p>
                            <div className="product-actions">
                                <button 
                                    onClick={addToCart} 
                                    className="add-to-cart"
                                    disabled={addingToCart} // Disable button while adding to cart
                                >
                                    {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
