import React, { useState, useEffect, useRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default function ImageCropPage() {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const cropperRef = useRef(null);

  // Initialize the Cropper.js
  useEffect(() => {
    if (image) {
      const cropper = new Cropper(cropperRef.current, {
        aspectRatio: 300 / 400, // Aspect ratio of 300x400
        viewMode: 1,
        autoCropArea: 1,
        responsive: true,
        zoomable: true,
        movable: true,
        scalable: true,
      });

      return () => cropper.destroy();
    }
  }, [image]);

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file)); // Preview image
    }
  };

  // Handle crop
  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = new Cropper(cropperRef.current);
      const canvas = cropper.getCroppedCanvas({
        width: 300,  // Set cropped image width
        height: 400, // Set cropped image height
      });
      setCroppedImage(canvas.toDataURL('image/jpeg')); // Get cropped image as data URL
    }
  };

  // Handle the upload of the cropped image
  const handleUpload = async () => {
    if (croppedImage) {
      const formData = new FormData();
      formData.append('image', croppedImage);  // Send the cropped image
      formData.append('description', 'Your description');
      formData.append('name', 'Product Name');
      // Include other necessary fields...

      // Send the data to your backend API
      const response = await fetch('http://127.0.0.1:8000/api/sellers/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log(result); // Handle response
    }
  };

  return (
    <div className="container">
      <h2>Crop Your Image</h2>
      {/* File upload */}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      
      {/* Image preview */}
      {image && (
        <div>
          <img
            ref={cropperRef}
            src={image}
            alt="Preview"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}

      {/* Crop button */}
      <button onClick={handleCrop}>Crop Image</button>

      {/* Display cropped image */}
      {croppedImage && (
        <div>
          <h3>Cropped Image</h3>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}

      {/* Upload button */}
      <button onClick={handleUpload}>Upload Cropped Image</button>
    </div>
  );
}
