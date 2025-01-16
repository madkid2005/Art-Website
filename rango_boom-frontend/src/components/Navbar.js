import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
// import categoryGif from "../assets/images/categorygif.gif";
import "./Navbar.css";
import axios from "axios";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [showdastebandi, setShowdastebandi] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/store/categories/")
      .then((response) => {
        setCategories(response.data);
        console.log(response.data);
        
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const hoverdastebandi = () => setShowdastebandi(true);
  const unhoverdastebandi = () => {
    setShowdastebandi(false);
    setHoveredCategory(null);
  };

  const handleMouseEnter = (categoryId) => setHoveredCategory(categoryId);
  const handleMouseLeave = () => setHoveredCategory(null);

  return (
    <div className="container">
      <div className="row mb-2 border-bottom">
        {/* دسته‌بندی */}
        <div
          onMouseEnter={hoverdastebandi}
          onMouseLeave={unhoverdastebandi}
          className="col-md-4 mt-3"
        >
          <button className="btn d-flex align-items-center">
            <span className="h5 mx-2">دسته بندی</span>
            <i className="bi bi-telephone-outbound fw-bold fs-4 text-success"></i>
          </button>
          <div >
            {showdastebandi && (
              <div  className="row position-relative">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="category position-relative"
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      cursor: "pointer",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <span>{category.name}</span>
                    {/* زیرمجموعه‌ها */}
                    {hoveredCategory === category.id &&
                      category.children &&
                      category.children.length > 0 && (
                        <div
                          className="children"
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "100%",
                            backgroundColor: "white",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            padding: "10px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            maxHeight: "200px",
                            overflowY: "auto",
                            width: "200px",
                            zIndex: "1000",
                          }}
                        >
                          {category.children.map((child) => (
                            <div
                              key={child.id}
                              style={{
                                padding: "5px",
                                borderBottom: "1px solid #f0f0f0",
                                cursor: "pointer",
                              }}
                              onClick={() => alert(`انتخاب شد: ${child.name}`)}
                            >
                              {child.name}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* لوگو */}
        <div className="col-md-4 text-center">
          <img
            className="mt-3"
            style={{ width: "300px" }}
            src={logo}
            alt="Logo"
          />
        </div>

        {/* آیکون‌ها */}
        <div className="col-md-4 mt-3">
          <div className="text-start">
            <button className="btn mx-2">
              <i className="bi bi-person-fill-gear fw-bold fs-4 text-secondary"></i>
            </button>
            <button className="btn mx-2">
              <i className="bi bi-bag-heart fw-bold fs-4 text-danger"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
