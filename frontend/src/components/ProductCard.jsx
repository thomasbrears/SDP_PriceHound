import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../css/ProductCard.css'; 

function ProductCard({ productName, productImg, price, date}) {
  const navigate = useNavigate(); // Initialize navigate hook
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    setLoading(true, `Searching for ${productName}...`); // Set loading with a message

    try {
      const response = await axios.get(`http://localhost:5001/api/search?query=${productName}`);
      setLoading(false); // Stop loading

      const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

      navigate('/product', { state: { searchResults: searchResults, query: productName } }); // Navigate with search results
    } catch (error) {
      console.error('Error fetching search results:', error);
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <div onClick={handleSearch} className="product-card"> {/* Call handleSearch on click */}
      <div className="product-image">
        <img src={productImg} alt={productName} /> {/* Dynamically set the image source */}
      </div>
      <h3 className="product-name">{productName}</h3>
      <h3 className="product-price">{price}</h3>
      <h3 className="product-price">{date}</h3>
    </div>
  );
}

export default ProductCard;
