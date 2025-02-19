import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "./css/Product_bestratings.css"; // Custom Styles

const Product_bestratings = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=bestratings")
            .then((response) => response.json())
            .then((data) => setProducts(data || []))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const GetIdProduct = (e) => {
        const ID = e.currentTarget.getAttribute("data-id");
        navigate(`/products/productdatial/${ID}`);
    };

    return (
        <div className="container-fluid mt-4">
    {/* Section Title */}
    <h2 className="text-center text-dark fw-bold mb-4">🌟 محصولات برتر</h2>

    {/* Product Carousel */}
    <div className="border-top border-bottom p-4   bg-white">
        <Swiper
            breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 5 },
                576: { slidesPerView: 4, spaceBetween: 5 },
                768: { slidesPerView: 6, spaceBetween: 5 },
                992: { slidesPerView: 7, spaceBetween: 5 },
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
        >
            {products.length > 0 ? (
                products.map((product) => {
                    const truncatedName =
                        product.name.length > 20
                            ? product.name.substring(0, 20) + "..."
                            : product.name;

                    return (
                        <SwiperSlide key={product.id}>
                            {/* Product Card */}
                            <div onClick={GetIdProduct} data-id={product.id} className="p-1 rounded-3 shadow-sm bg-light text-center transition-hover " style={{ cursor: "pointer" }}>
                                
                                {/* Product Image */}
                                <div className="product-image-wrapper product-up">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="img-fluid rounded-3 p-1"
                                        style={{ width: "100%", height: "250px", objectFit: "cover" }}
                                    />
                                </div>
                                <div className="product-card ">

                                    <div className="text-danger fw-bold ">
                                        <span className="fw-bold d-block text-dark text-truncate" style={{ maxWidth: "100%" }}>
                                            {truncatedName}
                                        </span>
                                        <div className="text-start">
                                            <div className="">
                                                {/* PRICE */}
                                                {product.sale_price ? (
                                                    <div className="text-start p-1 mt-3">

                                                        


                                                        <span className="fw-bold text-muted " style={{ textDecoration: "line-through" }}>
                                                            <small>
                                                                <i className="bi bi-percent text-danger ms-1"></i>
                                                                {product.formatted_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                                                            </small>
                                                        </span>

                                                        <br />

                                                        <span className="fw-bold text-danger fs-5">
                                                            <small><small>
                                                                {product.formatted_sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <small>تومان</small>
                                                            </small></small>
                                                        </span>

                                                    </div>
                                                ) : (
                                                    <div className="text-end fw-bold fs-5">
                                                        <small>{product.formatted_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</small>
                                                    </div>
                                                )}
                                            </div>                                        
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                            {/* Product Info */}
                            

                        </SwiperSlide>
                    );
                })
            ) : (
                <p className="text-center text-danger fw-bold">هیچ محصولی یافت نشد.</p>
            )}
        </Swiper>
    </div>
</div>

    );
};

export default Product_bestratings;
