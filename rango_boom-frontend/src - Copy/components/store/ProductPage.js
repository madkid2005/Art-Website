import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams(); // گرفتن شناسه دسته‌بندی از URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/store/products/?category=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        console.log('Fetched products:', data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [id]);
  
  return (
    <div className="container mt-5">
      <h2>Products in Category {id}</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-4">
            <img src={product.image} alt={product.name} className="img-fluid" />
            <h5>{product.name}</h5>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
