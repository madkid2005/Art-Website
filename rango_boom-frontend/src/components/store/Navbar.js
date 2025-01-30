import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import axios from "axios";
import "./css/Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [showPanels, setShowPanels] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // ذخیره دسته‌بندی انتخاب‌شده
  const navigate = useNavigate(); // ایجاد یک تابع برای هدایت به صفحه

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
      setSelectedCategory(categories[0]); // انتخاب پیش‌فرض اولین دسته‌بندی
    }
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category.id);
    setChildrenList(category.children || []);
  };


  const SendPageSeller = ()=>{
    navigate("/SingupSeller")
  }

  const handleMouseLeave = () => {
    setHoveredCategory(null);
    setShowPanels(false)
    setChildrenList([]);
  };

  const changepage = () => {
    navigate("/SingupBuyer");
  };

  return (
    <div className="container d-none d-md-block">
      <div className="row mb-2 border-bottom align-items-center">
        {/* دسته‌بندی */}
        <div className="col-md-4 mt-3 position-relative d-flex">
          <button
            className="btn d-flex align-items-center btn"
            onClick={handleCategoryClick}
            style={{
              transition: "all 0.3s ease-in-out",
              borderRadius: "8px",
            }}
          >
            <i className="bi bi-grid-fill fw-bold fs-4 text-primary"></i>
            <span className=" mx-2">دسته بندی</span>
          </button>
          <small onClick={SendPageSeller}>

          <p className="mt-3">فروشنده شوید</p>
          </small>
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
            <button onClick={changepage} className="btn mx-2">
              <i className="bi bi-person-fill-gear fw-bold fs-4 text-secondary"></i>
            </button>
            <button className="btn mx-2">
              <i className="bi bi-bag-heart fw-bold fs-4 text-danger"></i>
            </button>
          </div>
        </div>
      </div>

      {/* پنل دسته‌بندی و زیرمجموعه‌ها */}
      {showPanels  && (
        <div
          className="row z-3 position-fixed shadow"
          onMouseLeave={handleMouseLeave} // رویداد خروج موس برای کل پنل
          style={{
            position: "relative",
            backdropFilter: "blur(10px)", // اضافه کردن افکت بلور
            height: "100vh", // برای پوشش دادن تمام صفحه
          }}
        >
          {/* پنل دسته‌بندی‌ها */}
          <div
            className="col-4"
            style={{
              height: "400px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f1f1f1",
              paddin: "10px",
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
                    hoveredCategory === category.id || selectedCategory?.id === category.id
                      ? "#fff"
                      : "transparent",
                }}
                onClick={() => setSelectedCategory(category)} // انتخاب دسته‌بندی
              >
                <div className="d-flex">
                  <div className="col-1">
                    <i className=" mx-2 text-primary ">
                      <img className="img-fluid" src={category.icon} alt="" />
                    </i>
                  </div>
                  <span className="mx-4">{category.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* پنل زیرمجموعه‌ها */}
          <div className="col-7" style={{ height: "400px", overflowY: "auto", border: "1px solid #ddd", backgroundColor: "white", borderRadius: "12px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", padding: "10px" }}>
            <div className="row g-2">
              {childrenList.length > 0 ? (
                childrenList.map((child) => (
                  <div key={child.id} className="col-4">
                    <div
                      className="text-center shadow-sm py-3"
                      style={{
                        cursor: "pointer",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        transition: "transform 0.3s ease, background-color 0.3s, box-shadow 0.3s",
                        backgroundColor: "#f9f9f9",
                        textAlign: "center",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)",
                      }}
                      onClick={() => alert(`انتخاب شد: ${child.name}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                        e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.15)";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#f9f9f9";
                        e.currentTarget.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.05)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>{child.name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center text-muted">زیرمجموعه‌ای وجود ندارد</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
