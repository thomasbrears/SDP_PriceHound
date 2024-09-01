import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; // Import axios for API requests
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
  const navigate = useNavigate(); // Initialize navigate hook

  // Function to handle search rerun
  const handleSearch = async () => {
    try {
      // Make API call to backend to run searchapi.js with new search term
      const response = await axios.get(`http://localhost:5000/api/search?query=${encodeURIComponent(title)}`);
    
      const newSearchResults = response.data;
      
      // Navigate to product page with new search results
      navigate('/product', { state: { searchResults: newSearchResults } });
    } catch (error) {
      console.error('Error searching for the product:', error);
    }
  };

  return (
    <div className="comparison-card">
      {logo && (
        <div className="comparison-card-logo">
          <img 
            src={logo} 
            alt={`${title} logo`} 
            onError={(e) => e.target.src = '/path/to/placeholder-image.jpg'} 
          />
        </div>
      )}
      
      <div className="comparison-card-info">
        <h4 className="comparison-card-title">{title}</h4>
        <p className="comparison-card-subtext">
          {shippingInfo && <span>{shippingInfo}</span>}
          {deliveryTime && <span>{deliveryTime}</span>}
          {location && <span>{location}</span>}
        </p>
      </div>
  
      <div className="comparison-card-price-action">
        <h3 className="comparison-card-price">{price}</h3>
        { /* rerun search with the product name */ }
        <button onClick={handleSearch} className="comparison-card-button">Buy Now</button>
      </div>
    </div>
  );
}

export default ComparisonCard;