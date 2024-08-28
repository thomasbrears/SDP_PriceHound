import React from 'react';

const ProductInfo = ({ name, priceRange, rating, ratingCount, description }) => {
  return (
    <div className="product-info">
      <h2>{name}</h2>
      <div className="price-rating-container">
        <span className="price-range">{priceRange}</span>
        <span className="rating">
          {Array(Math.round(rating)).fill('⭐').join('')} ({ratingCount})
        </span>
      </div>
      <hr />
      <p className="description">{description}</p>
    </div>
  );
};

export default ProductInfo;
