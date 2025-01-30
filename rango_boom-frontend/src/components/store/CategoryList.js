import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./css/CategoryList.css";
import { useNavigate } from "react-router-dom"; // برای هدایت به صفحه جدید

export default function CategoryList() {
  const [listnames, setListnames] = useState([]);
  const navigate = useNavigate(); // ایجاد یک تابع برای هدایت به صفحه


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/store/categories/")
      .then((res) => res.json())
      .then((data) => {
        setListnames(data);
      });
  }, []);

  const checkname = (e) => {
    const valueID = e.currentTarget.getAttribute("data-name");
    console.log("Selected category:", valueID);
    navigate(`/products/category/${valueID}`); 

    
  };
  

  return (
    <div className="container mt-5">
      <Swiper
        slidesPerView={6}
        spaceBetween={20}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
        }}
        pagination={{ clickable: true }}
        className="mySwiper"
      >
        {listnames.map((category) => (
          <SwiperSlide key={category.id} className="category-slide">
            <div
              onClick={checkname}
              className="circle-border"
              data-name={category.id}
            >
              <img
                src={category.icon}
                alt={category.name}
                className="img-fluid"
              />
            </div>
            <span>{category.name}</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
