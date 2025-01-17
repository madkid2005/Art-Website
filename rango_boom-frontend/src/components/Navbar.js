import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import axios from "axios";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [showPanels, setShowPanels] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [childrenList, setChildrenList] = useState([]);

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

  const handleCategoryClick = () => {
    setShowPanels((prevState) => !prevState); // Toggle پنل‌ها
    if (showPanels) {
      setHoveredCategory(null);
      setChildrenList([]);
    }
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category.id);
    setChildrenList(category.children || []);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
    setChildrenList([]);
  };

  return (
    <div className="container">
      <div className="row mb-2 border-bottom">
        {/* دسته‌بندی */}
        <div className="col-md-4 mt-3 position-relative">
          <button
            className="btn d-flex align-items-center"
            onClick={handleCategoryClick}
          >
            <span className="h5 mx-2">دسته بندی</span>
            <i className="bi bi-telephone-outbound fw-bold fs-4 text-success"></i>
          </button>
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

      {/* پنل دسته‌بندی و زیرمجموعه‌ها */}
      {showPanels && (
        <div className="row">
          {/* پنل دسته‌بندی‌ها */}
          <div
            className="col-3"
            style={{
              height: "300px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              padding: "10px",
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="category"
                onMouseEnter={() => handleMouseEnter(category)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                  backgroundColor:
                    hoveredCategory === category.id ? "#e6f7ff" : "#f9f9f9",
                }}
              >
                <span>{category.name}</span>
              </div>
            ))}
          </div>

          {/* پنل زیرمجموعه‌ها */}
          <div
            className="col-4"
            style={{
              hheight: "300px",
              overflowY: "auto",
              border: "1px solid #ddd",
              backgroundColor: "white",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 0.1fr))", // تعداد ستون‌ها و عرض هر ستون
              gridAutoFlow: "row", // پر کردن ستون‌ها به صورت عمودی (ستون‌ها اول پر می‌شوند)
            }}
          >
            {childrenList.length > 0 ? (
              childrenList.map((child) => (
                <div
                  key={child.id}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onClick={() => alert(`انتخاب شد: ${child.name}`)}
                >
                  {child.name}
                </div>
              ))
            ) : (
              <div style={{ color: "#999" }}>زیرمجموعه‌ای وجود ندارد</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
