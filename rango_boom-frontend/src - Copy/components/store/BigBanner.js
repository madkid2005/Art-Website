import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

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
        <div className="container-fluid position-relative p-4">
            <Swiper
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1} // نمایش یک اسلاید در هر لحظه
                coverflowEffect={{
                    rotate: 30,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                navigation={{
                    nextEl: '.swiper-button-next', // Ensure navigation buttons are properly referenced
                    prevEl: '.swiper-button-prev',
                }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Navigation, Pagination]}
                className="mySwiper"
                style={{ paddingBottom: "30px" }} // کاهش فضای اضافی پایین اسلایدر
            >
                {Bigbanners.map((Bigbanner, index) => (
                    <SwiperSlide key={index} className="d-flex justify-content-center">
                        <img 
                            src={Bigbanner.image} 
                            className="w-100 rounded-3 mb-3" 
                            alt={`بنر ${index + 1}`} 
                            style={{ maxHeight: "400px", objectFit: "cover" }} // حفظ تناسب تصویر
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom navigation buttons */}
            <div className="swiper-button-prev" style={{ position: 'absolute', left: '10px', top: '50%', zIndex: 10 }}></div>
            <div className="swiper-button-next" style={{ position: 'absolute', right: '10px', top: '50%', zIndex: 10 }}></div>
        </div>
    );
}
