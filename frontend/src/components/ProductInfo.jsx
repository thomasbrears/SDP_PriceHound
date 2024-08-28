import React from 'react';

const ProductInfo = ({ name, priceRange, rating, ratingCount, description }) => {
  return (
    <div className="product-info">
      <h2>{name}</h2>
      <p className="price-range">{priceRange}</p>
      <p className="rating">
        {rating} / 5 stars ({ratingCount} Ratings)
      </p>
      <hr />
      <p className="description">{description}</p>
    </div>
  );
};

export default ProductInfo;
