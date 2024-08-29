import React from 'react';
import '../css/ComparisonCard.css'; 

function ComparisonCard({ 
  logo, 
  title, 
  price, 
  link, 
  shippingInfo, 
  deliveryTime, 
  location 
}) {
  return (
    <div className="comparison-card">
      {/* Logo Section */}
      <div className="comparison-card-logo">
        <img src={logo} alt={`${title} logo`} onError={(e) => e.target.src = '/path/to/placeholder-image.jpg'} />
      </div>
      
      <div className="comparison-card-info">
        <h4 className="comparison-card-title">{title}</h4>
        <p className="comparison-card-subtext">
          <span>{shippingInfo}</span>
          <span>{deliveryTime}</span>
          <span>{location}</span>
        </p>
      </div>
  
      <div className="comparison-card-price-action">
        <h3 className="comparison-card-price">{price}</h3>
        <a href={link} className="comparison-card-button">Buy Now</a>
      </div>
    </div>
  );
}

export default ComparisonCard;