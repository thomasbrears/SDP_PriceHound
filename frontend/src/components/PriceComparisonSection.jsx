import React from 'react';
import { FaShippingFast } from 'react-icons/fa';

const PriceComparisonSection = ({ retailers }) => {
  return (
    <section className="price-comparison">
      <h3>Let's Compare Prices</h3>
      <div className="retailers">
        {retailers.map((retailer, index) => (
          <div key={index} className="retailer-card">
            <img src={retailer.logo} alt={retailer.name} className="retailer-logo" />
            <div className="retailer-info">
              <p>{retailer.name}</p>
              <p className="price">${retailer.price.toFixed(2)}</p>
              <div className="shipping-icon-container">
                <FaShippingFast className="shipping-icon" />
                <div className="shipping-tooltip">
                  {retailer.location ? <span>Ships from {retailer.location}</span> : ""}
                  {retailer.shippingInfo && retailer.shippingInfo !== "0" ? (
                    <span>| Free shipping on orders over ${retailer.shippingInfo}</span>
                  ) : ""}
                  {retailer.deliveryInfo ? <span>| Estimated delivery: {retailer.deliveryInfo}</span> : ""}
                </div>
              </div>
            </div>
            <a 
              href={retailer.link} 
              className="buy-now"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Buy Now
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PriceComparisonSection;
