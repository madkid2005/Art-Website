import React, { useState } from "react";

export default function Test() {
  const [products, setProducts] = useState(null);

  const SendAPI = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/store/categories/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="text-center">
      <h1>صفحه تست</h1>
      <h1 className="fw-bold">
        کیا رو دیکه پایین که کلیک کردی ای پی ای استفاده میکنه و بعد توی قیمت اینسپت سایت نشون میده که وضیعت چطور فقط هر ای پی ای خوسایت تست کنی قبلش لینک ببین
      </h1>
      <button onClick={SendAPI} className="btn btn-outline-danger">
        Send API
      </button>
      {products && <pre>{JSON.stringify(products, null, 2)}</pre>}
    </div>
  );
}
