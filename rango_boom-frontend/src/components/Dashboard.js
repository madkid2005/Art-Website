import React, { useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/sellers/profile/")
        .then(response => {
            console.log(response.data); // داده‌های دریافتی از API را چاپ کنید
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    }, []);

    return (
        <div>Dashboard</div>
    );
}