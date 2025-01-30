import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

import { Pagination, Navigation } from "swiper/modules";
import "./css/Product_bestratings.css"; // فایل استایل سفارشی

const Product_bestratings = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    // دریافت داده‌ها از API
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=bestratings")
            .then((response) => response.json())
            .then((data) => setProducts(data || [])) // مقدار پیش‌فرض در صورت undefined
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const GetIdProduct = (e)=>{
        const ID = e.currentTarget.getAttribute("data-ID")
        console.log('====================================');
        console.log(ID);
        console.log('====================================');
        navigate(`/products/productdatial/${ID}`)
    }
    return (
        <div className="container-fluid m-2 rtl">
            <h2 className="text-center text-dark font-weight-bold mb-4">
                محصولات برتر
            </h2>
            <div className="border p-3 border-2 rounded-3">

            <Swiper
    slidesPerView={window.innerWidth < 768 ? 2 : 5} // نمایش کمتر در موبایل
    spaceBetween={20}
    navigation={true}
    modules={[Pagination, Navigation]}
    className="mySwiper"
>
    {products.length > 0 ? (
        products.map((product) => (
            <SwiperSlide key={product.id}>
                <div onClick={GetIdProduct} data-ID={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <div className="p-2">
                        <span className="product-title">{product.name}</span>
                        <div className="product-prices">
                            <h6>
                                {Math.floor(product.price)}
                                <small className="mx-2">تومان</small>
                            </h6>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        ))
    ) : (
        <p className="text-center text-danger">هیچ محصولی یافت نشد.</p>
    )}
</Swiper>

            </div>
        </div>
    );
};

export default Product_bestratings;
