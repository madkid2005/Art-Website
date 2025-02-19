import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/BigBanner.css"
export default function ProductPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/store/products/?category=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [id]);

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center mb-4">محصولات دسته {id}</h2>
      <div className="row border rounded-3">
        {products.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((product) => (
          <div key={product.id} className="col-md-3 col-6 m-0 p-0 border-productspace hovershadow">
            <div className="">
              <img src={product.image} alt={product.name} className="w-100 p-5" />
              <div className=" ">
                <p className="card-title me-3">{product.name}</p>
                {/* <p className="card-text text-muted">{product.description.slice(0, 30)}...</p> */}
                <small>
                <small>

                <p className=" font-weight-bold text-start ms-3">{product.price} تومان</p>
                </small>
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center mt-4">
        {page > 0 && (
          <button onClick={handlePrevPage} className="btn btn-secondary mx-2">صفحه قبلی</button>
        )}
        {products.length > (page + 1) * itemsPerPage && (
          <button onClick={handleNextPage} className="btn btn-primary mx-2">صفحه بعدی</button>
        )}
      </div>
    </div>
  );
}
