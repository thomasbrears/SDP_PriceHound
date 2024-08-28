import React from 'react';

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
              <div className="shipping-details">
                <p>{retailer.shippingInfo}</p>
                <p>{retailer.deliveryInfo}</p>
                <p>{retailer.location}</p>
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
