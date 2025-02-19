import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "./css/Product_bestratings.css";

export default function Product_onSale() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=on_sale")
            .then((response) => response.json())
            .then((data) => setProducts(data || []))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const GetIdProduct = (e) => {
        const ID = e.currentTarget.getAttribute("data-id");
        navigate(`/products/productdatial/${ID}`);
    };

    // Helper function to truncate text with ellipsis
    const truncateText = (text, limit) => {
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    return (
        <div className="container">
            <div className="row bg-danger rounded-4 p-4 text-white shadow-sm">
                <div className="col-12">
                    {/* Title & Navigation */}
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="fw-bold mb-3">🔥 پیشنهادات ویژه</h4>
                        <div className="d-flex">
                            <div className="custom-prev mx-2 fs-1 cursor-pointer text-white">‹</div>
                            <div className="custom-next mx-2 fs-1 cursor-pointer text-white">›</div>
                        </div>
                    </div>

                    {/* Swiper Container */}
                    <div className="swiper-container">
                        <Swiper
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 5 },
                                576: { slidesPerView: 3, spaceBetween: 10 },
                                768: { slidesPerView: 4, spaceBetween: 15 },
                                992: { slidesPerView: 5, spaceBetween: 20 },
                                1200: { slidesPerView: 6, spaceBetween: 20 },
                            }}
                            navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                        >
                            {products.length > 0 ? (
                                products.map((product) => {
                                    const shortName = truncateText(product.name, 40); // Truncate to 40 characters
                                    const displayPrice = product.sale_price
                                        ? Math.floor(product.sale_price).toLocaleString()
                                        : Math.floor(product.price).toLocaleString();

                                    return (
                                        <SwiperSlide key={product.id} className="bg-white rounded-3 shadow-sm p-2 ms-2">
                                            <div
                                                onClick={GetIdProduct}
                                                data-id={product.id}
                                                className="position-relative text-center cursor-pointer"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={shortName}
                                                    className="img-fluid w-100 rounded-1"
                                                    style={{ maxHeight: "200px", objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className="p-2 text-center">
                                                {/* Product Name */}
                                                <p className="text-dark fw-bold" style={{ fontSize: "19px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {shortName}
                                                </p>
                                                <div className=" text-start">

                                                    {/* Pricing Section */}
                                                    <div className="product-prices">
                                                        <p className="fw-bold text-danger fs-6 mb-0">
                                                            {displayPrice}
                                                            <small className="mx-1">تومان</small>
                                                        </p>

                                                        {product.sale_price && (
                                                            <span
                                                                className="text-muted text-decoration-line-through fs-6"
                                                            >
                                                                {Math.floor(product.price).toLocaleString()}
                                                                <small className="">تومان</small>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })
                            ) : (
                                <p className="text-center">هیچ محصولی یافت نشد.</p>
                            )}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
}
