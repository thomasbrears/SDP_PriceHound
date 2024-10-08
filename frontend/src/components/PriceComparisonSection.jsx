import React from "react";
import { FaShippingFast } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../FirebaseAuth/Firebase"; 
import { useState, useEffect } from "react"; 
import "../css/PriceComparisonCard.css"; // Import CSS for the section

const placeholderImage =
  "https://www.aut.ac.nz/__data/assets/file/0009/166932/AUT-logo-block-white.svg";

  const PriceComparisonSection = ({ retailers }) => {
    const [verifiedLogos, setVerifiedLogos] = useState([]);
  
    // Fetch verified shop logos from Firestore
    useEffect(() => {
      const fetchVerifiedLogos = async () => {
        const querySnapshot = await getDocs(collection(db, "verifiedCompany")); // Fetch from 'verifiedCompany' collection
        const logos = [];
        querySnapshot.forEach((doc) => {
          // Get all logo URLs from the document fields
          Object.values(doc.data()).forEach((logo) => logos.push(logo));
        });
        setVerifiedLogos(logos); // Set the verified logos in state
      };
  
      fetchVerifiedLogos();
    }, []);

      // Function to check if a shop is verified
  const isVerifiedShop = (shopLogo) => {
    return verifiedLogos.includes(shopLogo);
  };

  // Function to shorten and clean titles
  const shortenTitle = (title) => {
    if (!title) return "";

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
          const shortenedTitle = shortenTitle(retailer.title); // Clean and shorten title

          return (
            <div
              key={index}
              className={`retailer-card ${
                !retailer.shopLogo ? "retailer-card-no-logo" : ""
              }`}
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

              {/* Conditionally render the verification badge */}
              {isVerifiedShop(retailer.shopLogo) && (
                <div className="company-verification-badge">
                  <img
                    src="../images/verifiedCompany.png"
                    alt="Verified Company"
                    className="verification-badge-image"
                  />
                </div>
              )}

              <div className="retailer-info">
                <p>{shortenedTitle}</p>
                <div className="price-shipping-container">
                  <p className="price">{retailer.price}</p>
                  <div className="shipping-icon-container">
                    <FaShippingFast className="shipping-icon" />
                    <div className="shipping-tooltip">
                      {retailer.location && <span>{retailer.location}</span>}
                      {retailer.shippingAvailable && (
                        <span>{retailer.shippingAvailable}</span>
                      )}
                      {retailer.deliveryInfo && (
                        <span>| {retailer.deliveryInfo}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Check if the shopLink is valid */}
              {retailer.shopLink ? (
                <a
                  href={retailer.shopLink}
                  className="buy-now"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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