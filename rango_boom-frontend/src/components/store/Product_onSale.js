import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import "./css/Product_bestratings.css";
import { useNavigate } from "react-router-dom";

const ProductSlider = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=on_sale")
            .then((response) => response.json())
            .then((data) => setProducts(data || []))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const GetIdProduct = (e) => {
        const ID = e.currentTarget.getAttribute("data-ID");
        navigate(`/products/productdatial/${ID}`);
    };

    return (
        <div className="container my-4 rtl">
            <h2 className="text-center text-dark font-weight-bold mb-3">
                محصولات تخفیف خورده
            </h2>
            <div className="border p-3 border-3 rounded-5 bg-light">
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
                                <div onClick={GetIdProduct} data-ID={product.id} className="product-card position-relative bg-white rounded-lg shadow-sm p-2">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="p-1 img-fluid w-100 rounded"
                                    />
                                </div>
                                <div className="p-2 text-center">
                                    <span className="product-title text-truncate d-block font-weight-bold">
                                        {product.name}
                                    </span>
                                    <div className="product-prices text-center">
                                        <h6 className="text-dark font-weight-bold">
                                            {Math.floor(product.price)}
                                            <small className="mx-2">تومان</small>
                                        </h6>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <p className="text-center">هیچ محصولی یافت نشد.</p>
                    )}
                </Swiper>
            </div>
        </div>
    );
};

export default ProductSlider;
