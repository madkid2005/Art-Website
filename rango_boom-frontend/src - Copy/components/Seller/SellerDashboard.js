import React, { useEffect, useState, useRef } from 'react';
import DashboardPNG from "../../assets/images/SellerDashboard.png";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import "./css/ProductForm.css";

export default function SellerDashboard() {
  const [activePanel, setActivePanel] = useState('addProduct');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [seller, setSeller] = useState('');
  const [slug, setSlug] = useState('');
  const [stock, setStock] = useState('');
  const [category_id, setCategory_id] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [size, setSize] = useState('');
  const [image, setImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState('https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA'); 
  const [croppedImage, setCroppedImage] = useState(null); 
  // sale 
  const [onSale, setOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const cropperRef = useRef(null);

  const Access = localStorage.getItem("access") || "";

  const handlePanelChange = (panel) => {
    setActivePanel(panel);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          setImage(img); // Store the image
          setImagePreview(reader.result);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const GetSellerID = () => {
    const id = localStorage.getItem('seller_id');
    setSeller(id);
    console.log(id);
  };

  useEffect(() => {
    GetSellerID();
  }, []);

  // Initialize Cropper.js when image is available
  useEffect(() => {
    if (image) {
      const cropper = new Cropper(cropperRef.current, {
        aspectRatio: 300 / 400, 
        viewMode: 1,
        autoCropArea: 1,
        responsive: true,
        zoomable: true,
        movable: true,
        scalable: true,
      });

      return () => cropper.destroy(); // Cleanup on component unmount
    }
  }, [image]);

  // Handle crop action
  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      const resizedCanvas = resizeImage(croppedCanvas); // Resize to 300x400 pixels
      const resizedImageData = resizedCanvas.toDataURL(); 
      console.log(resizedImageData);

      const mimeType = resizedImageData.split(';')[0].split(':')[1];
      setCroppedImage(resizedImageData); 
    } else {
      console.error("Cropper instance is not available");
    }
  };

  // Resize the image to 300x400
  const resizeImage = (canvas) => {
    const ctx = canvas.getContext('2d');
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = 300; // Set width to 300
    resizedCanvas.height = 400; // Set height to 400
    const resizedCtx = resizedCanvas.getContext('2d');
    resizedCtx.drawImage(canvas, 0, 0, 300, 400); // Resize image
    return resizedCanvas;
  };

  const APISENDCRATEPRODUCT = async () => {
    if (!Access) {
      console.error("No access token found");
      return;
    }

    const formData = new FormData();
    formData.append('category_id', category_id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);

    formData.append('seller', seller);
    formData.append('slug', slug);
    //size
    formData.append('dimensions', dimensions);
    formData.append('size', size);
    //sale
    formData.append('on_sale', onSale);
    if (onSale) {
      formData.append('sale_price', salePrice);
    }

    // Append cropped image to FormData if available
    if (croppedImage) {
      const byteString = atob(croppedImage.split(',')[1]); // Decode base64 string
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uintArray], { type: 'image/jpeg' });
      formData.append('image', blob, 'product-image.jpg'); // Add a filename to the image blob
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/sellers/products/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Access}`,
        },
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Response:", data);
        alert('Product successfully created!');
      } else {
        console.error("Error:", data);
        alert(data?.image?.[0] || "An error occurred");
      }
    } catch (error) {
      console.error("Error sending product data:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* نوار کناری */}
        <div className="col-md-2 bg-white p-4 shadow-sm vh-100 d-flex flex-column align-items-center">
          <div className="d-flex justify-content-center mt-4">
            <div className="rounded-circle border border-2 p-2">
              <img className="img-fluid rounded-circle" src={DashboardPNG} alt="تصویر داشبورد" />
            </div>
          </div>
          <h5 className="text-center mt-3 fw-bold">فروشگاه اپینو</h5>
          <p className="text-center text-muted">مهدی حسینیان</p>
  
          <div className="w-100 mt-3">
            <button className="btn d-flex align-items-center w-100 p-2 text-start shadow-sm border-0" onClick={() => handlePanelChange('addProduct')}>
              <i className="bi bi-folder-plus me-2 fs-5 text-primary"></i> اضافه کردن محصول
            </button>
  
            <button className="btn d-flex align-items-center w-100 p-2 text-start shadow-sm border-0 mt-2 text-danger" onClick={() => handlePanelChange('logout')}>
              <i className="bi bi-door-closed me-2 fs-5"></i> خروج از حساب
            </button>
          </div>
  
          <button className="btn w-100 rounded-3 text-white mt-3 shadow-sm" style={{ backgroundColor: "#783dd5" }}>
            ویرایش اطلاعات
          </button>
        </div>
  
        {/* محتوای اصلی */}
        <div className="col-md-10" style={{ backgroundColor: "#f3f2f8", minHeight: "100vh", padding: "2rem" }}>
          {activePanel === 'addProduct' && (
            <div className="card shadow-sm p-4">
              <h3 className="fw-bold text-primary mb-4">افزودن محصول جدید</h3>
              <form onSubmit={(e) => { e.preventDefault(); APISENDCRATEPRODUCT(); }}>
                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold">دسته‌بندی</label>
                    <input type="number" className="form-control rounded-3" value={category_id} onChange={(e) => setCategory_id(e.target.value)} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold">نام محصول</label>
                    <input type="text" className="form-control rounded-3" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold">توضیحات</label>
                    <input type="text" className="form-control rounded-3" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold">قیمت</label>
                    <input type="number" className="form-control rounded-3" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>

                  <div className="col-md-6 mb-3 d-flex align-items-center">
                    <input type="checkbox" className="me-2" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} />
                    <label className="fw-semibold me-1">تخفیف دارد</label>
                  </div>
                  {onSale && (
                    <div className="col-md-6 mb-3">
                      <label className="fw-semibold">قیمت بعد از تخفیف‌ </label>
                      <input type="number" className="form-control rounded-3" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
                    </div>
                  )}
                </div>
  
                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="fw-semibold">ابعاد</label>
                    <input type="text" className="form-control rounded-3" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold">اندازه</label>
                    <input type="text" className="form-control rounded-3" value={size} onChange={(e) => setSize(e.target.value)} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold">شناسه یکتا (Slug)</label>
                    <input type="text" className="form-control rounded-3" value={slug} onChange={(e) => setSlug(e.target.value)} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold">موجودی</label>
                    <input type="number" className="form-control rounded-3" value={stock} onChange={(e) => setStock(e.target.value)} />
                  </div>


                </div>
                <div className="row">

                  {/* بارگذاری تصویر */}
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold">تصویر محصول</label>
                    <input type="file" className="form-control rounded-3" onChange={handleImageChange} />
                  </div>
    
                  {imagePreview && (
                    <div className="image-preview mt-3 text-end">
                      <img ref={cropperRef} src={imagePreview} alt="پیش‌نمایش تصویر" className="img-fluid shadow-sm rounded-3" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                      <button type="button" onClick={handleCrop} className="btn btn-outline-primary mt-3 me-3">برش تصویر</button>
                    </div>
                  )}
    
                  {croppedImage && (
                    <div className="image-preview mt-3 text-center">
                      <h5 className="fw-bold">تصویر برش‌خورده</h5>
                      <img src={croppedImage} alt="تصویر برش‌خورده" className="img-fluid shadow-sm rounded-3" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                    </div>
                  )}
              </div>

                <button type="submit" className="btn w-100 rounded-3 mt-3 text-white fw-bold" style={{ backgroundColor: "#783dd5" }}>
                  ارسال محصول
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  
}
