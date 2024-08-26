// AddRetailer.jsx
import React, { useState } from 'react';

function AddRetailer() {
  const [name, setName] = useState('');
  const [verified, setVerified] = useState(false);
  const [domain, setDomain] = useState('');
  const [shippingFrom, setShippingFrom] = useState('');
  const [shippingTimeToNZ, setShippingTimeToNZ] = useState('');
  const [hasFreeShippingThreshold, setHasFreeShippingThreshold] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const retailerData = {
      name,
      verified,
      domain,
      shippingFrom,
      shippingTimeToNZ,
      freeShippingThreshold: hasFreeShippingThreshold ? freeShippingThreshold : null,
    };

    try {
      const response = await fetch('/api/retailers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(retailerData),
      });

      if (response.ok) {
        alert('Retailer added successfully');
        setName('');
        setVerified(false);
        setDomain('');
        setShippingFrom('');
        setShippingTimeToNZ('');
        setHasFreeShippingThreshold(false);
        setFreeShippingThreshold('');
      } else {
        alert('Failed to add retailer');
      }
    } catch (error) {
      console.error('Error adding retailer:', error);
      alert('Failed to add retailer');
    }
  };

  return (
    <form className="add-retailer-form" onSubmit={handleSubmit}>
      <h2>Add Retailer</h2>
      <label>
        Retailer Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Verified:
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
        />
      </label>
      <label>
        Domain:
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
      </label>
      <label>
        Shipping From:
        <input
          type="text"
          value={shippingFrom}
          onChange={(e) => setShippingFrom(e.target.value)}
          required
        />
      </label>
      <label>
        Shipping Time to NZ:
        <input
          type="text"
          value={shippingTimeToNZ}
          onChange={(e) => setShippingTimeToNZ(e.target.value)}
          required
        />
      </label>
      <label>
        Free Shipping Threshold:
        <input
          type="checkbox"
          checked={hasFreeShippingThreshold}
          onChange={(e) => setHasFreeShippingThreshold(e.target.checked)}
        />
      </label>
      {hasFreeShippingThreshold && (
        <label>
          Threshold Amount:
          <input
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
            required={hasFreeShippingThreshold}
          />
        </label>
      )}
      <button type="submit">Add Retailer</button>
    </form>
  );
}

export default AddRetailer;
