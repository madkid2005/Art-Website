import React from 'react';

export default function Footer() {
  return (
    <div className="container-fluid">
      <div className="row py-4" style={{ backgroundColor: "#060e25" }}>
        
        {/* اطلاعات تماس و آدرس */}
        <div className="col-12 col-md-3 d-flex flex-column align-items-start text-white">
          <h4 className="mt-3 me-4 fw-bold">RangoBoom</h4>
          <p className="mt-2 me-4">
            شماره تماس :
            <a href="tel:09056860284" className="text-decoration-none text-white ms-2 hover-effect">
              09056860284 <i className="bi bi-telephone-fill"></i>
            </a>
          </p>
          <p className="mt-2 me-4">
            آدرس :
            <a href="https://www.google.com/maps?q=خیابان+فرشته+به+طرف+ولیعصر" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-white ms-2 hover-effect">
              خیابان فرشته به طرف ولیعصر <i className="bi bi-geo-alt-fill"></i>
            </a>
          </p>
        </div>

        {/* آیکون‌های شبکه‌های اجتماعی */}
        <div className="col-12 col-md-3 d-flex justify-content-center align-items-center gap-3 mt-3">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-icon text-white fs-4 instagram">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://wa.me/09056860284" target="_blank" rel="noopener noreferrer" className="social-icon text-white fs-4 whatsapp">
            <i className="bi bi-whatsapp"></i>
          </a>
        </div>

      </div>
    </div>
  );
}
