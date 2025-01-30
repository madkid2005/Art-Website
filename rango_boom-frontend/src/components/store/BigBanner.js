import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';

export default function BigBanner() {
    const [Bigbanners, setBigbanners] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/banners/") // API برای بارگذاری تصاویر
            .then(res => res.json())
            .then(data => {
                const filteredBanners = data.filter(banner => banner.order <= 5);
                setBigbanners(filteredBanners); // ذخیره تصاویر فیلتر شده در state
            })
            .catch(error => console.error("Error fetching banners:", error));
    }, []);

    return (
        <div className="container-fluid z-1 ">
            <Swiper
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1} // تنظیم برای نمایش یک اسلاید در هر بار
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination]}
                className="mySwiper"
            >
                {Bigbanners.map((Bigbanner, index) => (
                    <SwiperSlide key={index}>
                        <img src={Bigbanner.image} className="w-100" alt={`Banner ${index + 1}`} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
