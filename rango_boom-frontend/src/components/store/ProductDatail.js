import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/ProductDetail.css'; // اضافه کردن فایل CSS برای استایل‌ها

export default function ProductDetail() {
    const { ID } = useParams();
    const [product, setProduct] = useState(null); // برای ذخیره داده‌ها
    const [loading, setLoading] = useState(true); // برای وضعیت بارگذاری
    const [error, setError] = useState(null); // برای ذخیره خطاها

    useEffect(() => {
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
            <div className="row ">
                <div className="col-md-12 justify-content-center  mt-2 shadow rounded-3 d-flex">

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
                            <p className="product-price">Price: ${product.seller}</p>
                            <div className="product-actions">
                                <button className="add-to-cart">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
