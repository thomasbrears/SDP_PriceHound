import React, { useState } from 'react';

const AddRetailerForm = ({ onRetailerAdded }) => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [logo, setLogo] = useState('');
  const [verified, setVerified] = useState(false);
  const [shippingFrom, setShippingFrom] = useState('');
  const [shippingTimeToNZ, setShippingTimeToNZ] = useState('');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const retailerData = {
      name,
      domain,
      logo,
      verified,
      shippingDetails: {
        shippingFrom,
        shippingTimeToNZ,
        freeShippingThreshold,
      },
    };

    try {
      const response = await fetch('http://localhost:8000/api/retailers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(retailerData),
      });

      if (response.ok) {
        alert('Retailer added successfully');
        const newRetailer = await response.json();
        onRetailerAdded(newRetailer); // Notify parent component about the new retailer
      } else {
        alert('Failed to add retailer');
      }
    } catch (error) {
      console.error('Error adding retailer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="retailer-form">
      <h2>Add Retailer</h2>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Domain:</label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Logo URL:</label>
        <input
          type="text"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Verified:</label>
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
        />
      </div>
      <div className="form-group">
        <label>Shipping From:</label>
        <input
          type="text"
          value={shippingFrom}
          onChange={(e) => setShippingFrom(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Shipping Time to NZ:</label>
        <input
          type="text"
          value={shippingTimeToNZ}
          onChange={(e) => setShippingTimeToNZ(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Free Shipping Threshold:</label>
        <input
          type="number"
          value={freeShippingThreshold}
          onChange={(e) => setFreeShippingThreshold(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Retailer</button>
    </form>
  );
};

export default AddRetailerForm;
