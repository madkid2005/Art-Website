import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import "./css/Product_bestratings.css"; // فایل استایل سفارشی
import { useNavigate } from "react-router-dom";

const ProductSlider = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    // دریافت داده‌ها از API
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=on_sale")
            .then((response) => response.json())
            .then((data) => setProducts(data || [])) // مقدار پیش‌فرض در صورت undefined
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const GetIdProduct = (e)=>{
        const ID = e.currentTarget.getAttribute("data-id")
        console.log('====================================');
        console.log(ID);
        console.log('====================================');
        navigate(`/products/productdatial/${ID}`)
    }
    return (
        <div className="container-fluid m-2 rtl">
            <h2 className="text-center text-dark font-weight-bold mb-3">
                محصولات تخفیف خورده
            </h2>
            <div className="border p-3 border-3 rounded-5">

                <Swiper
                    slidesPerView={6}
                    spaceBetween={20}

                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                >
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <div onClick={GetIdProduct} data-id={product.id}  className="product-card position-relative bg-white rounded-lg">
                                    {/* تایمر بالای کارت */}

                                    {/* تصویر محصول */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="p-1 img-fluid w-100"
                                    />
                                    
                                </div>
                                {/* اطلاعات محصول */}
                                <div className="p-2">
                                        <span className="product-title text-truncate mb-2 ">
                                            {product.name}
                                        </span>
                                        <div className="product-prices text-start">

                                            <h6 className="text-dark font-weight-bold d-block">
                                                {Math.floor(product.price)}
                                                <small>
                                                    <small className="mx-2">


                                                        تومان
                                                    </small>
                                                </small>
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
