import React, { useEffect, useState } from 'react';
import './css/CenterBanner.css'; // Import custom CSS for fade-in animation

export default function CenterBanner() {
    const [Bigbanners, setBigbanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/store/banners/") // API برای بارگذاری تصاویر
            .then(res => res.json())
            .then(data => {
                const filteredBanners = data.filter(banner => banner.order >= 6 && banner.order <= 8);
                setBigbanners(filteredBanners); // ذخیره تصاویر فیلتر شده در state
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                setError(error.message); // Handle error case
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="container my-4 text-center">
                <p>Loading banners...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-4 text-center">
                <p>Error loading banners: {error}</p>
            </div>
        );
    }

    return (
        <div className="container my-4">
            <div className="row g-3">
                {Bigbanners.map((Bigbanner, index) => (
                    <div key={index} className="col-12 col-md-4">
                        <div className="card shadow-sm border-0">
                            <img 
                                src={Bigbanner.image} 
                                className="card-img-top rounded-3 fade-in" // Apply fade-in class
                                alt={`Banner ${index + 1}`} 
                                style={{ objectFit: 'cover', height: '390px' }} // Prevent image stretching
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
