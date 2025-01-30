import React, { useEffect, useState } from 'react';

export default function CenterBanner() {
    const [Bigbanners, setBigbanners] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/banners/") // API برای بارگذاری تصاویر
            .then(res => res.json())
            .then(data => {
                const filteredBanners = data.filter(banner => banner.order >= 6 && banner.order <= 8);
                setBigbanners(filteredBanners); // ذخیره تصاویر فیلتر شده در state
            })
            .catch(error => console.error("Error fetching banners:", error));
    }, []);

    return (
        <div className="container my-4">
            <div className="row">
                {Bigbanners.map((Bigbanner, index) => (
                    <div key={index} className="col-12 col-md-4 mb-3">
                        <img 
                            src={Bigbanner.image} 
                            className="img-fluid rounded shadow" 
                            alt={`Banner ${index + 1}`} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
