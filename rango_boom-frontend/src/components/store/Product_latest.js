import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import "./css/Product_bestratings.css"; // Custom Styles
import { useNavigate } from "react-router-dom";

const Product_latest = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=latest")
            .then((response) => response.json())
            .then(data => setProducts(data || []))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const GetIdProduct = (e) => {
        const ID = e.currentTarget.getAttribute("data-id");
        navigate(`/products/productdatial/${ID}`);
    };

    // Helper function to truncate product names
    const truncateText = (text, limit) => {
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    return (
        <div className="container mt-5">
            {/* Section Title */}
            <h2 className="text-center text-dark fw-bold mb-4">🆕 آخرین محصولات</h2>

            {/* Product Slider */}
            <div className="border p-3 rounded-3 shadow-sm bg-light">
                <Swiper
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 10 },
                        576: { slidesPerView: 3, spaceBetween: 10 },
                        768: { slidesPerView: 4, spaceBetween: 15 },
                        992: { slidesPerView: 5, spaceBetween: 20 },
                        1200: { slidesPerView: 6, spaceBetween: 20 },
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                >
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <SwiperSlide key={product.id}>
                                {/* Product Card */}
                                <div
                                    onClick={GetIdProduct}
                                    data-id={product.id}
                                    className="product-card position-relative text-center bg-white rounded-1 shadow-sm transition-hover"
                                    style={{ cursor: "pointer" }}
                                >
                                    {/* Product Image */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className=" img-fluid w-100 rounded-3"
                                        style={{ height: "250px", objectFit: "cover" }}
                                    />

                                    
                                </div>
                                {/* Product Info */}
                                <div className="p-2 mt-1">
                                        {/* Product Name (Truncated) */}
                                        <span
                                            className="fw-bold d-block text-dark mb-2"
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {truncateText(product.name, 30)}
                                        </span>

                                        {/* Product Price */}
                                        <h6 className="text-danger fw-bold mb-0 text-start mt-3">
                                            {Math.floor(product.price).toLocaleString()}
                                            <small className="ms-1">تومان</small>
                                        </h6>
                                    </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <p className="text-center text-muted">هیچ محصولی یافت نشد.</p>
                    )}
                </Swiper>
            </div>
        </div>
    );
};

export default Product_latest;
