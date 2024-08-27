import React, { useState } from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 


function AddProductPage() {
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
    <div className="add-project-page">
      <MainHeadTitle 
        title="Add Products and Retailers" 
        subtitle="add products n retailers  placeholder page"
      />
     
      <div className="add-forms-container">
        <div className="add-product-form-container">
          {/* <AddProduct /> */}
        </div>
        <div className="add-retailer-form-container">
          {/* <AddRetailer /> */}
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;
