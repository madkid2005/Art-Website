import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import bgByuyer from "../assets/images/buyerlogin.png";
import "./Signup.css"
export default function Signup() {
  const [number, setNumber] = useState("");
  const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleInputChange = (e) => setNumber(e.target.value);

  const handlePhoneSubmit = () => {
    if (number.length === 11) {
      fetch("http://127.0.0.1:8000/api/buyers/otp/", {
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
    fetch("http://127.0.0.1:8000/api/buyers/login/", {
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
      .then(() => alert("کد تأیید با موفقیت ارسال شد!"))
      .catch(() => alert("خطا در تأیید کد!"));
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ height: "90vh", direction: "rtl" }}>
      <div className="row w-100">
        <div className="col-md-2"></div>
<div className="text-center d-md-none">

        <img src={logo} alt="" className="w-75 mt-0" />
</div>
        <div className="col-md-8 border d-md-flex d-sm-grid p-4" style={{ borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
          <div className=" col-md-6 d-flex align-items-center justify-content-center">
            <div className="text-center">

              <img src={logo} alt="" className="w-75 mt-0 d-none d-md-block" />
              <img src={bgByuyer} alt="" className="d-none d-md-block" style={{ borderRadius: "8px", width: "80%" }} />
            </div>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">

            <div className="p-4" style={{ maxWidth: "400px", margin: "0 auto" }}>

              <h4 className="text-end mb-2 fw-bold">ورود | ثبت‌نام</h4>
              <small>

                <span className="text-end mb-3 text-muted">لطفا شماره موبایل یا ایمیل خود را وارد کنید</span>
              </small>

              {!isPhoneSubmitted ? (
                <>
                  <div className="mt-3">
                    <input
                      type="number"
                      className=" w-100  focusborderinput"
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

        <div className="col-md-2"></div>
      </div>
    </div>
  );
}
