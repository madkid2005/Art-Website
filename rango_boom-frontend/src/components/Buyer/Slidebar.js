import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Slidebar.css'; // فایل CSS را وارد کنید
import AccountInfo from './AccountInfo';

const Sidebar = () => {
  const Access = localStorage.getItem("accessBuyer") || "";
  const navigate = useNavigate();

  const [showprofile, setShowprofile] = useState({
    name: "",
    family_name: '',
    email: "",
    address: "",
    phone_number: "",
  });

  const [activePanel, setActivePanel] = useState("account"); // مدیریت پنل باز شده

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/buyers/profile/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Access}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setShowprofile(data))
      .catch((error) => console.error("Error:", error));
  }, [Access]);

  const handlePanelToggle = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessBuyer");
    navigate("/SignupBuyer");
  };

  return (
    <div className="container mt-4">
      <div className="row">

        {/* بخش لیست‌های منو */}
        <div className="col-md-3 sidebar-menu">
          <div className="profile-section text-center">
            <h5>{showprofile.name} {showprofile.family_name}</h5>
            <p>{showprofile.phone_number}</p>
          </div>
          <div className="list-group border">

            <button className="list-group-item list-group-item-action py-3  border-0" onClick={() => handlePanelToggle("account")}>
              <i className="bi bi-person-circle me-2"></i> اطلاعات حساب کاربری
            </button>
            
            <button className="list-group-item list-group-item-action py-3 border-0" onClick={() => handlePanelToggle("orders")}>
              <i className="bi bi-cart-check me-2"></i> سفارش‌ها
            </button>
            <button className="list-group-item list-group-item-action py-3 border-0" onClick={() => handlePanelToggle("lists")}>
              <i className="bi bi-heart me-2"></i> لیست‌های من
            </button>
            <button className="list-group-item list-group-item-action py-3 border-0" onClick={() => handlePanelToggle("addresses")}>
              <i className="bi bi-geo-alt me-2"></i> آدرس‌ها
            </button>
            <button className="list-group-item list-group-item-action py-3 border-0" onClick={() => handlePanelToggle("messages")}>
              <i className="bi bi-chat-dots me-2"></i> پیام‌ها
            </button>
            <button className="list-group-item list-group-item-action py-3 border-0" onClick={() => handlePanelToggle("recent")}>
              <i className="bi bi-clock-history me-2"></i> بازدیدهای اخیر
            </button>
            <button className="list-group-item list-group-item-action text-danger border-0 py-3" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> خروج
            </button>
          </div>
        </div>

        {/* بخش محتوای پنل */}
        <div className="col-md-8 content-panel">
          {activePanel && (
            <div className="card p-3">
              {activePanel === "account" && <div><h5>اطلاعات حساب</h5>

                <AccountInfo />
                <p>لیست سفارش‌های شما نمایش داده می‌شود.</p>


              </div>}

              {activePanel === "orders" && <div><h5>سفارش‌ها</h5><p>لیست سفارش‌های شما نمایش داده می‌شود.</p></div>}
              {activePanel === "lists" && <div><h5>لیست‌های من</h5><p>لیست‌های ذخیره‌شده شما اینجاست.</p></div>}
              {activePanel === "addresses" && <div><h5>آدرس‌ها</h5><p>اینجا می‌توانید آدرس‌های خود را مدیریت کنید.</p></div>}
              {activePanel === "messages" && <div><h5>پیام‌ها</h5><p>پیام‌های دریافتی شما در اینجا نمایش داده می‌شود.</p></div>}
              {activePanel === "recent" && <div><h5>بازدیدهای اخیر</h5><p>محصولاتی که اخیراً مشاهده کرده‌اید.</p></div>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
