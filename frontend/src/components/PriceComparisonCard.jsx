import React from 'react';
import '../css/PriceComparisonCard.css';

const PriceComparisonCard = ({ logo, retailerName, price, link, shippingInfo, isSubItem }) => {
  return (
    <div className="price-comparison-card">
      {!isSubItem && logo && (
        <img src={logo} alt={`${retailerName} logo`} className="retailer-logo" />
      )}
      <div className="retailer-details">
        <h4 className="retailer-name">{retailerName}</h4>
        <p className="shipping-info">{shippingInfo}</p>
      </div>
      <div className="price-section">
        <p className="price">{price}</p>
        {/* Ensure the link prop is the direct shop link */}
        <a href={link} className="buy-now-button" target="_blank" rel="noopener noreferrer">
          Buy Now
        </a>
      </div>
    </div>
  );
};

export default PriceComparisonCard;
