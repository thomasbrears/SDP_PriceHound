import React from 'react';
import { FaShippingFast } from 'react-icons/fa';

const placeholderImage = 'https://www.aut.ac.nz/__data/assets/file/0009/166932/AUT-logo-block-white.svg';

const PriceComparisonSection = ({ retailers }) => {
  const shortenTitle = (title) => {
    const keywordsToRemove = [
      'with', 'and', 'for', 'includes', 'edition', 'bundle', 'pack', 'set', 'new', 'sale', 
      'discount', 'free', 'shipping', 'limited', 'offer', 'special', 'save', 'deal', 
      'best', 'cheap', 'buy', 'online', 'fast', 'original'
    ];
    
    let cleanedTitle = title;

    keywordsToRemove.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      cleanedTitle = cleanedTitle.replace(regex, '');
    });

    cleanedTitle = cleanedTitle.trim();

    const maxLength = 50;
    if (cleanedTitle.length > maxLength) {
      cleanedTitle = cleanedTitle.substring(0, maxLength) + '...';
    }

    return cleanedTitle;
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.alt = 'Image Unavailable';
  };

  return (
    <section className="price-comparison">
      <h3>Let's Compare Prices</h3>
      <div className="retailers">
        {retailers.map((retailer, index) => {
          const price = parseFloat(retailer.price.replace(/[^0-9.-]+/g, ''));
          const shortenedTitle = shortenTitle(retailer.title);

          return (
            <div key={index} className="retailer-card">
              <img 
                src={retailer.shopLogo} 
                alt={shortenedTitle} 
                className="retailer-logo" 
                onError={handleImageError} // Handle image load error
              />
              <div className="retailer-info">
                <p>{shortenedTitle}</p>
                <p className="price">
                  {isNaN(price) ? 'Price Not Available' : `$${price.toFixed(2)}`}
                </p>
                <div className="shipping-icon-container">
                  <FaShippingFast className="shipping-icon" />
                  <div className="shipping-tooltip">
                    {retailer.location ? <span>{retailer.location}</span> : ""}
                    {retailer.shippingAvailable ? (
                      <span>{retailer.shippingAvailable}</span>
                    ) : ""}
                    {retailer.deliveryInfo ? <span>| {retailer.deliveryInfo}</span> : ""}
                  </div>
                </div>
              </div>
              <a 
                href={retailer.shopLink} 
                className="buy-now"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Buy Now
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PriceComparisonSection;
