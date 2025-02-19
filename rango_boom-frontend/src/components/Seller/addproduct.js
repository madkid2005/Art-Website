import React, { useState } from "react";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    dimensions: "",
    size: "",
    is_on_sale: false,
    sale_price: "",
    fast_send: false,
    image: null,
  });

  const [customFeatures, setCustomFeatures] = useState([
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFeatureChange = (index, e) => {
    const { name, value } = e.target;
    const newFeatures = [...customFeatures];
    newFeatures[index][name] = value;
    setCustomFeatures(newFeatures);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredFeatures = customFeatures.filter(
      (feature) => feature.key && feature.value
    );

    const productData = {
      ...formData,
      custom_features: filteredFeatures,
    };

    const formDataToSend = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === "custom_features") {
        formDataToSend.append(key, JSON.stringify(productData[key]));
      } else {
        formDataToSend.append(key, productData[key]);
      }
    });

    fetch("/api/sellers/products/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessBuyer")}`,
      },
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product created:", data);
      })
      .catch((error) => {
        console.error("Error creating product:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Product Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Stock:</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Dimensions:</label>
        <input type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} />
      </div>

      <div>
        <label>Size:</label>
        <input type="text" name="size" value={formData.size} onChange={handleInputChange} />
      </div>

      <div>
        <label>Sale Price:</label>
        <input type="number" name="sale_price" value={formData.sale_price} onChange={handleInputChange} disabled={!formData.is_on_sale} />
      </div>

      <div>
        <label>
          <input type="checkbox" name="is_on_sale" checked={formData.is_on_sale} onChange={handleInputChange} />
          Is On Sale?
        </label>
      </div>

      <div>
        <label>
          <input type="checkbox" name="fast_send" checked={formData.fast_send} onChange={handleInputChange} />
          Fast Send?
        </label>
      </div>

      <div>
        <label>Product Image:</label>
        <input type="file" name="image" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
      </div>

      <h4>Custom Features</h4>
      {customFeatures.map((feature, index) => (
        <div key={index}>
          <input type="text" name="key" placeholder="Feature Name" value={feature.key} onChange={(e) => handleFeatureChange(index, e)} />
          <input type="text" name="value" placeholder="Feature Value" value={feature.value} onChange={(e) => handleFeatureChange(index, e)} />
        </div>
      ))}

      <button type="submit">Submit Product</button>
    </form>
  );
}
