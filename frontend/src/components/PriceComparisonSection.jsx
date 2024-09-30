import React from "react";
import { FaShippingFast } from "react-icons/fa";
import "../css/PriceComparisonCard.css"; // Import CSS for the section

const placeholderImage =
  "https://www.aut.ac.nz/__data/assets/file/0009/166932/AUT-logo-block-white.svg";

const PriceComparisonSection = ({ retailers }) => {
  // Function to shorten and clean titles
  const shortenTitle = (title) => {
    const keywordsToRemove = [
      "with",
      "and",
      "for",
      "includes",
      "edition",
      "bundle",
      "pack",
      "set",
      "new",
      "sale",
      "discount",
      "free",
      "shipping",
      "limited",
      "offer",
      "special",
      "save",
      "deal",
      "best",
      "cheap",
      "buy",
      "online",
      "fast",
      "original",
    ];

    let cleanedTitle = title;

    keywordsToRemove.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      cleanedTitle = cleanedTitle.replace(regex, "");
    });

    cleanedTitle = cleanedTitle.trim();

    const maxLength = 50;
    if (cleanedTitle.length > maxLength) {
      cleanedTitle = cleanedTitle.substring(0, maxLength) + "...";
    }

    return cleanedTitle;
  };

  // Function to handle image errors
  const handleImageError = (e) => {
    e.target.src = placeholderImage; // Replace with placeholder if image is unavailable
    e.target.alt = "Image Unavailable";
  };

  return (
    <section className="price-comparison">
      <h3>Let's Compare Prices</h3>
      <div className="retailers">
        {retailers.map((retailer, index) => {
          const price = parseFloat(retailer.price.replace(/[^0-9.-]+/g, "")); // Parse price
          const shortenedTitle = shortenTitle(retailer.title); // Clean and shorten title
  
          return (
            <div
              key={index}
              className={`retailer-card ${!retailer.shopLogo ? "retailer-card-no-logo" : ""}`}
            >
              {retailer.shopLogo ? (
                <img
                  src={retailer.shopLogo || "/images/image-unavailable.jpg"}
                  alt={shortenedTitle}
                  className="retailer-logo"
                  onError={handleImageError} // Handle image load error
                />
              ) : (
                <div style={{ width: "20px", marginRight: "20px" }}></div>
              )}
  
              <div className="retailer-info">
                <p>{shortenedTitle}</p>
                <div className="price-shipping-container">
                  <p className="price">
                    {isNaN(price) ? "Price Not Available" : `$${price.toFixed(2)}`}
                  </p>
                  <div className="shipping-icon-container">
                    <FaShippingFast className="shipping-icon" />
                    <div className="shipping-tooltip">
                      {retailer.location && <span>{retailer.location}</span>}
                      {retailer.shippingAvailable && <span>{retailer.shippingAvailable}</span>}
                      {retailer.deliveryInfo && <span>| {retailer.deliveryInfo}</span>}
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Check if the shopLink is valid */}
              {retailer.shopLink ? (
                <a href={retailer.shopLink} className="buy-now" target="_blank" rel="noopener noreferrer">
                  Buy Now
                </a>
              ) : (
                <button className="buy-now-disabled" disabled>
                  No Link Available
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );  
};

export default PriceComparisonSection;
