// AddProductPage.jsx
import React from 'react';
import AddProduct from '../components/AddProduct'; 
import AddRetailer from '../components/AddRetailer'; 
import '../css/AddProduct.css';

function AddProductPage() {
  return (
    <div className="add-project-page">
      <h1>Add Products and Retailers</h1>
      <div className="add-forms-container">
        <div className="add-product-form-container">
          <AddProduct />
        </div>
        <div className="add-retailer-form-container">
          <AddRetailer />
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;
