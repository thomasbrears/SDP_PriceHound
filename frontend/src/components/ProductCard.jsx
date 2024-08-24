import React from 'react';
import '../css/ProductCard.css';

function ProductCard({ productName, price, link }) {
  return (
    <a href={link} className="product-card">
      <div className="product-image"></div>
      <h3 className="product-name">{productName}</h3>
      <p className="product-price">${price.toFixed(2)}</p>
    </a>
  );
}

export default ProductCard;
