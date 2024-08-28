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
              <p className="price">{retailer.price}</p>
              <p className="shipping-info">{retailer.shippingInfo}</p>
              <p className="delivery-info">{retailer.deliveryInfo}</p>
              <p className="location">Ships from: {retailer.location}</p>
            </div>
            <button className="buy-now">Buy Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PriceComparisonSection;
