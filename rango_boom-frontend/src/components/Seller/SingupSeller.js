import React, { useState } from "react";
import "./css/Signup.css"
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const [number, setNumber] = useState("");
  const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
const navigate = useNavigate("")
  const handleInputChange = (e) => setNumber(e.target.value);

  const handlePhoneSubmit = () => {
    if (number.length === 11) {
      fetch("http://127.0.0.1:8000/api/sellers/generate-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: number }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(() => {
          alert("OTP ارسال شد!");
          setIsPhoneSubmitted(true);
        })
        .catch(() => alert("خطا در ارسال شماره!"));
    } else {
      alert("شماره وارد شده باید 11 رقمی باشد!");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        handleOtpSubmit(newOtp.join(""));
      }
    }
  };

  const handleOtpSubmit = (otpCode) => {
    fetch("http://127.0.0.1:8000/api/sellers/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: otpCode, mobile_number: number }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data=>{
        console.log('====================================');
        console.log(data);
        console.log('====================================');

        localStorage.setItem("access",data.access)
        localStorage.setItem("refresh",data.refresh)
      })
      .then(() => 
        navigate("../SellerDashboard")
      
      )
      .catch(() => alert("خطا در تأیید کد!"));
  };

  return (
    <div className="bg-imgseller container-fluid d-flex align-items-center justify-content-center" style={{ height: "100vh", direction: "rtl" }}>
      <div className="row w-100">

        <div className="col-md-1">

        </div>

        <div className="col-md-9  d-md-flex d-sm-grid " style={{ borderRadius: "8px" }}>
          <div className="  d-flex align-items-center justify-content-center">
            <div className="text-center">

              <div className="p-4" style={{ maxWidth: "400px", margin: "0 auto" }}>

              <h3 className="text-end mb-2 fw-bold">ورود | ثبت‌نام</h3>

                <p className="text-end mb-3 text-muted">لطفا شماره موبایل یا ایمیل خود را وارد کنید</p>

              {!isPhoneSubmitted ? (
                <>
                  <div className="mt-3">
                    <input
                      type="number"
                      className=" w-100 p-2  focusborderinput"
                      style={{}}
                      placeholder="شماره موبایل"
                      value={number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    className=" mt-3 btnrgb w-100"
                    onClick={handlePhoneSubmit}
                  >
                    ورود
                  </button>
                </>
              ) : (
                <>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="form-control text-center font-weight-bold"
                      value={number}
                      disabled
                      style={{ backgroundColor: "#e9ecef" }}
                    />
                  </div>
                  <div className="d-flex justify-content-between" style={{ direction: "ltr" }}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        className="form-control text-center mx-1 mt-3 font-weight-bold"
                        style={{ width: "40px", border: "1px solid #272af5" }}
                      />
                    ))}
                  </div>
                </>
              )}

                <p className="text-center mt-3 mb-0 text-muted" style={{ fontSize: "12px" }}>
                  ورود شما به معنای پذیرش شرایط

                    رنگ و بوم
                  و قوانین حریم‌خصوصی است
                </p>
            </div>
            </div>
            
          </div>
       


        </div>

        <div className="col-md-2 ">

        </div>
      </div>
    </div>
  );
}
