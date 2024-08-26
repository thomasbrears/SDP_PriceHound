import React, { useState } from 'react';



function AddRetailer() {
  const [name, setName] = useState('');
  const [verified, setVerified] = useState(false);
  const [domain, setDomain] = useState('');
  const [shippingFrom, setShippingFrom] = useState('');
  const [shippingTimeToNZ, setShippingTimeToNZ] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const retailerData = {
      name,
      verified,
      domain,
      shippingFrom,
      shippingTimeToNZ,
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
        // Reset form
        setName('');
        setVerified(false);
        setDomain('');
        setShippingFrom('');
        setShippingTimeToNZ('');
      } else {
        alert('Failed to add retailer');
      }
    } catch (error) {
      console.error('Error adding retailer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <br />
      <label>
        Verified:
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
        />
      </label>
      <br />
      <label>
        Domain:
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Shipping From:
        <input
          type="text"
          value={shippingFrom}
          onChange={(e) => setShippingFrom(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Shipping Time to NZ:
        <input
          type="text"
          value={shippingTimeToNZ}
          onChange={(e) => setShippingTimeToNZ(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Add Retailer</button>
    </form>
  );
}

export default AddRetailer;
