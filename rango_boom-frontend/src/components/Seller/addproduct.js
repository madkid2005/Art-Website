import React, { useState } from 'react';

export default function AddProductForm() {
  const [customFeatures, setCustomFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ key: '', value: '' });

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setNewFeature({ ...newFeature, [name]: value });
  };

  const addFeature = () => {
    if (customFeatures.length >= 6) {
      alert('You can only add up to 6 features.');
      return;
    }
    setCustomFeatures([...customFeatures, newFeature]);
    setNewFeature({ key: '', value: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      // other product fields (name, description, price, etc.)
      custom_features: customFeatures
    };

    fetch('/api/sellers/products/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessBuyer')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Product created:', data);
    })
    .catch(error => {
      console.error('Error creating product:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h4>Custom Features</h4>
        {customFeatures.map((feature, index) => (
          <div key={index}>
            <p>{feature.key}: {feature.value}</p>
          </div>
        ))}
        <div>
          <label>Key:</label>
          <input
            type="text"
            name="key"
            value={newFeature.key}
            onChange={handleFeatureChange}
          />
        </div>
        <div>
          <label>Value:</label>
          <input
            type="text"
            name="value"
            value={newFeature.value}
            onChange={handleFeatureChange}
          />
        </div>
        <button type="button" onClick={addFeature}>Add Feature (+)</button>
        <br />
        <button type="submit">Submit Product</button>
      </div>
    </form>
  );
}
