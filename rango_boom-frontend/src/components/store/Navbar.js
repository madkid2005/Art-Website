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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [userRole, setUserRole] = useState(null); // Store the user's role (buyer/seller)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if the user is authenticated
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    axios
      .get("http://127.0.0.1:8000/api/store/categories/")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    // Check if the user is authenticated (by token)
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true);

      // Fetch user data to determine if they are a buyer or seller
      axios
        .get("http://127.0.0.1:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserRole(response.data.role); // Assuming 'role' is 'buyer' or 'seller'
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      // Get user role
      const role = localStorage.getItem("user_role");
      setUserRole(role);

      // Fetch cart items 
      axios
        .get("http://127.0.0.1:8000/api/orders/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setCartItems(response.data.items))
        .catch((error) => console.error("Error fetching cart items:", error));
    }
  }, []);

  const toggleCategoryPanel = () => {
    setShowPanels((prev) => !prev);
    if (showPanels) {
      setHoveredCategory(null);
      setChildrenList([]);
      setSelectedCategory(categories[0]);
    }
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category.id);
    setChildrenList(category.children || []);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
    setShowPanels(false);
    setChildrenList([]);
  };
  const selectCategoryID = (e) => {
    const ID = e.currentTarget.getAttribute("data-id");
    navigate(`/products/category/${ID}`);

};


  return (
    <div className="container  d-none d-md-block">
      <div className="row mb-2 border-bottom align-items-center">
        {/* دسته‌بندی */}
        <div className="col-md-4 mt-3 position-relative d-flex">
          <button
            className="btn d-flex align-items-center"
            onClick={toggleCategoryPanel}
            style={{ transition: "all 0.3s ease-in-out", borderRadius: "8px" }}
          >
            <i className="bi bi-grid-fill fw-bold fs-4 text-primary"></i>
            <span className="mx-2">دسته بندی</span>
          </button>
          <small onClick={() => navigate("/SingupSeller")}>
            <p className="mt-3">فروشنده شوید</p>
          </small>
        </div>

        {/* لوگو */}
        <div onClick={() => navigate("/")} className="col-md-4  text-center">
          <img className="mt-3" style={{ width: "300px" }} src={logo} alt="Logo" />
        </div>

        {/* آیکون‌ها */}
        <div className="col-md-4 mt-3">
          <div className="text-start">
            {/* Conditionally render the signup buttons based on the user role */}
            {!isAuthenticated && (
              <>
                <button onClick={() => navigate("/SingupBuyer")} className="btn mx-2">
                  <i className="bi bi-person-fill-gear fw-bold fs-4 text-secondary"></i>
                </button>
                <button onClick={() => navigate("/SingupSeller")} className="btn mx-2">
                  <i className="bi bi-person-badge fw-bold fs-4 text-primary"></i>
                </button>
              </>
            )}

            {/* If the user is a buyer, show the dashboard button and hide the signup button */}
            {isAuthenticated && userRole === "buyer" && (
              <>
                <button onClick={() => navigate("/dashboard")} className="btn mx-2">
                  <i className="bi bi-house-door fw-bold fs-4 text-success"></i> Dashboard
                </button>
              </>
            )}

            {/* If the user is a seller, show the dashboard button and hide the signup button */}
            {isAuthenticated && userRole === "seller" && (
              <>
                <button onClick={() => navigate("/dashboard")} className="btn mx-2">
                  <i className="bi bi-house-door fw-bold fs-4 text-success"></i> Dashboard
                </button>
              </>
            )}

            {/* Cart and Order buttons */}
            <button className="btn mx-2" onClick={() => navigate("/cart")}>
              <i className="bi bi-bag-heart fw-bold fs-4 text-danger"></i>
              {cartItems.length > 0 && <span className="badge badge-light">{cartItems.length}</span>}
            </button>
            <button
              onClick={() => (cartItems.length > 0 ? navigate("/place-order") : alert("Your cart is empty."))}
              className="btn mx-2"
            >
              <i className="bi bi-cart-check fw-bold fs-4 text-success"></i>
            </button>
          </div>
        </div>
      </div>

      {/* پنل دسته‌بندی و زیرمجموعه‌ها */}
      {showPanels && (
        <div
          className="row z-3 position-fixed shadow"
          onMouseLeave={handleMouseLeave}
          style={{
            backdropFilter: "blur(10px)",
            height: "100vh",
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
              padding: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="category rightanim"
                onMouseEnter={() => handleMouseEnter(category)}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                  backgroundColor: hoveredCategory === category.id ? "#fff" : "transparent",
                }}
              >
                <div className="d-flex">
                  <div className="col-1">
                    <i className="mx-2 text-primary">
                      <img className="img-fluid" src={category.icon} alt="" />
                    </i>
                  </div>
                  <span className="mx-4">{category.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* پنل زیرمجموعه‌ها */}
          <div
            className="col-7"
            style={{
              height: "400px",
              overflowY: "auto",
              border: "1px solid #ddd",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "10px",
            }}
          >
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
                      // onClick={() =>  setSelectedId(childId);};
                      onClick={selectCategoryID} data-id={child.id}
                      
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
      <div className="container-fluid d-md-none fixed-bottom bg-light shadow-lg border-top">
      <div className="row">
        <div className="col-3 text-center py-2">
          <i className="bi bi-house-door fs-4"></i>
          <div className="small">خانه</div>
        </div>
        <div className="col-3 text-center py-2">
          <i className="bi bi-search fs-4"></i>
          <div className="small">جستجو</div>
        </div>
        <div className="col-3 text-center py-2">
          <i className="bi bi-bell fs-4"></i>
          <div className="small">اعلان‌ها</div>
        </div>
        <div className="col-3 text-center py-2">
          <i className="bi bi-person fs-4"></i>
          <div className="small">پروفایل</div>
        </div>
      </div>
    </div>
    </div>

    // MOBILE RESPANSIVE

  );
}
