import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../css/ProductCard.css'; 

function ProductCard({ productName, productImg, price, date, setLoading }) {
  const navigate = useNavigate(); 

const handleSearch = async () => {
  setLoading(true, `Searching for ${productName}...`); // Set loading with a message

  try {
    const response = await axios.get(`http://localhost:5001/api/search`, {
      params: {
        query: productName, 
      }
    });

    setLoading(false); 

    const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

    if (searchResults && searchResults.length > 0) {

      const isSpecific = searchResults.some(item => item.title && item.shopLogo);

      if (isSpecific) {
        navigate('/product', { state: { searchResults, searchQuery: productName, priceRanges: fetchedPriceRanges } });
      } else {
        navigate('/search', { state: { searchResults, query: productName, priceRanges: fetchedPriceRanges } });
      }
    } else {
      console.log("No results found");
      setLoading(false);
    }
  } catch (error) {
    console.error('Error searching for the product:', error);
    setLoading(false); 
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
