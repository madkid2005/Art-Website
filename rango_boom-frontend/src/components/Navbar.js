import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import axios from "axios";
import "./Navbar.css"

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
      <div className="row mb-2 border-bottom align-items-center">
        {/* دسته‌بندی */}
        <div className="col-md-4 mt-3 position-relative">
          <button
            className="btn d-flex align-items-center btn "
            onClick={handleCategoryClick}
            style={{
              transition: "all 0.3s ease-in-out",
              borderRadius: "8px",
            }}
          >
            <i className="bi bi-grid-fill fw-bold fs-4 text-primary"></i>
            <span className=" mx-2">دسته بندی</span>
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
        <div
          className="row mt-3"
          onMouseLeave={handleMouseLeave} // رویداد خروج موس برای کل پنل
          style={{ position: "relative" }}
        >
          {/* پنل دسته‌بندی‌ها */}
          <div
            className="col-3"
            style={{
              height: "300px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f1f1f1",
              padding: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="category rightanim"
                onMouseEnter={() => handleMouseEnter(category)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                  backgroundColor:
                    hoveredCategory === category.id ? "#fff" : "transparent",
                }}
              >
                <i className="bi bi-folder2-open mx-2 text-primary"></i>
                <span>{category.name}</span>
              </div>
            ))}
          </div>

          {/* پنل زیرمجموعه‌ها */}
          <div
            className="col-6"
            style={{
              height: "300px",
              overflowY: "auto",
              border: "1px solid #ddd",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "10px",
              transition: "all 0.3s ease",
            }}
          >
            {childrenList.length > 0 ? (
              childrenList.map((child) => (
                <div
                  key={child.id}
                  className="text-center p-2 shadow"
                  style={{
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    transition: "transform 0.2s ease, background-color 0.2s",
                    backgroundColor: "#f9f9f9",
                    alignContent:"center",
                  }}
                  onClick={() => alert(`انتخاب شد: ${child.name}`)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e6f7ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9f9f9")
                  }
                >
                  <i className="bi bi-box-seam text-success fs-4 icon-hover"></i>

                  <div>{child.name}</div>
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
