import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import "./css/Product_bestratings.css"; // فایل استایل سفارشی
import { useNavigate } from "react-router-dom";

const Product_latest = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=latest")
            .then((response) => response.json())
            .then(data => {
                setProducts(data || []);
                console.log('====================================');
                console.log(data);
                console.log('====================================');
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const GetIdProduct = (e) => {
        const ID = e.currentTarget.getAttribute("data-ID");
        console.log('====================================');
        console.log(ID);
        console.log('====================================');
        navigate(`/products/productdatial/${ID}`);
    };

    return (
        <div className="container-fluid m-2 rtl">
            <h2 className="text-center text-dark font-weight-bold mb-4">
                محصولات برتر
            </h2>
            <div className="border p-3 border-2 rounded-3 bg-light shadow-sm">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
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
                                <div onClick={GetIdProduct} data-ID={product.id} className="product-card position-relative d-flex flex-column align-items-center bg-white rounded-lg p-3 shadow">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="p-2 img-fluid w-100 rounded"
                                    />
                                    <div className="p-2 text-center">
                                        <span className="product-title text-truncate mb-2 font-weight-bold">
                                            {product.name}
                                        </span>
                                        <div className="product-prices text-center">
                                            <h6 className="text-dark font-weight-bold d-block">
                                                {Math.floor(product.price)}
                                                <small>
                                                    <small className="mx-2">تومان</small>
                                                </small>
                                            </h6>
                                        </div>
                                    </div>
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
