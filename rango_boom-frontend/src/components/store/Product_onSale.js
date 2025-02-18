import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import "./css/Product_bestratings.css";
import { useNavigate } from "react-router-dom";

export default function Product_onSale() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=on_sale")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setProducts(data || []);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const GetIdProduct = (e) => {
        const ID = e.currentTarget.getAttribute("data-ID");
        navigate(`/products/productdatial/${ID}`);
    };

    return (
        <div className="container">
            <div className="row rounded-4" style={{ backgroundColor: "#ef4255" }}>
                <div className="col-md-12 text-white ">
                    <div className="d-flex justify-content-between" dir="rtl">
                        <div>
                            <h4 className="fw-bold font-homa mt-3 me-2">شگفت انگیز</h4>
                        </div>
                        <div className="d-flex">
                            <div className="custom-prev h1 fw-bold mx-2 "></div>
                            <div
                                className="custom-prev h1 mx-2 mt-2 border border-white px-3"
                                style={{ borderRadius: "50%" }}
                            >
                                ‹
                            </div>
                            <div
                                className="custom-next h1 mx-2 mt-2 border border-white px-3"
                                style={{ borderRadius: "50%" }}
                            >
                                ›
                            </div>
                        </div>
                    </div>

                    <div className="swiper-container" style={{ position: "relative" }}>
                        <Swiper
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 2 },
                                576: { slidesPerView: 4, spaceBetween: 2 },
                                768: { slidesPerView: 6, spaceBetween: 2 },
                                992: { slidesPerView: 7, spaceBetween: 2 },
                                1200: { slidesPerView: 8, spaceBetween: 2 },
                            }}
                            navigation={{
                                prevEl: ".custom-prev",
                                nextEl: ".custom-next",
                            }}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                        >
                            {products && products.length > 0 ? (
                                products.map((product) => {
                                    // Shorten the product name to 30 characters
                                    const shortName = product.name.length > 30
                                        ? product.name.substring(0, 30) + "..."
                                        : product.name;

                                    // Check if the product has a sale price and display the appropriate price
                                    const displayPrice = product.sale_price
                                        ? Math.floor(product.sale_price).toLocaleString()
                                        : Math.floor(product.price).toLocaleString();

                                    return (
                                        <SwiperSlide key={product.id} className="bg-white rounded-1">
                                            <div
                                                onClick={GetIdProduct}
                                                data-ID={product.id}
                                                className="position-relative mt-3"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={shortName}
                                                    className="p-1 img-fluid w-100 rounded"
                                                />
                                            </div>
                                            <div className="p-2 text-center">
                                                <span className="text-black">{shortName}</span>
                                                <div className="product-prices text-start">
                                                    <p className="text-dark font-weight-bold mb-0">
                                                        {displayPrice}
                                                        <small className="mx-2">تومان</small>
                                                    </p>

                                                    {product.sale_price && (
                                                        <span
                                                            className="text-muted text-start"
                                                            style={{ textDecoration: "line-through" }}
                                                        >
                                                            <small>
                                                            {Math.floor(product.price).toLocaleString()}

                                                            <small className="mx-2 font-homa">تومان</small>
                                                            </small>
                                                        </span>
                                                    )}
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
