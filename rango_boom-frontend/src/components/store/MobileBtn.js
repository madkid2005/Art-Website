import React, { useState } from "react";

const MobileBtn = () => {
  const [active, setActive] = useState("home"); // صفحه پیش‌فرض خانه است

  return (
    <div className="container-fluid d-md-none fixed-bottom bg-light shadow-lg border-top">
     
    
      <div className="row">
        <div className="col-3 text-center py-2" onClick={() => setActive("home")}>
          <i className={`bi bi-house-door fs-4 ${active === "home" ? "text-dark fw-bold" : "text-secondary"}`}></i>
          <div className={`small ${active === "home" ? "text-dark fw-bold" : "text-secondary"}`}>خانه</div>
        </div>
        <div className="col-3 text-center py-2" onClick={() => setActive("search")}>
          <i className={`bi bi-search fs-4 ${active === "search" ? "text-dark fw-bold" : "text-secondary"}`}></i>
          <div className={`small ${active === "search" ? "text-dark fw-bold" : "text-secondary"}`}>جستجو</div>
        </div>
        <div className="col-3 text-center py-2" onClick={() => setActive("notifications")}>
          <i className={`bi bi-bell fs-4 ${active === "notifications" ? "text-dark fw-bold" : "text-secondary"}`}></i>
          <div className={`small ${active === "notifications" ? "text-dark fw-bold" : "text-secondary"}`}>اعلان‌ها</div>
        </div>
        <div className="col-3 text-center py-2" onClick={() => setActive("profile")}>
          <i className={`bi bi-person fs-4 ${active === "profile" ? "text-dark fw-bold" : "text-secondary"}`}></i>
          <div className={`small ${active === "profile" ? "text-dark fw-bold" : "text-secondary"}`}>پروفایل</div>
        </div>
      </div>
    </div>
  );
};

export default MobileBtn;
