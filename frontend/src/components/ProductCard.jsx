import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../css/ProductCard.css'; 

// Dynamically set the search API URL based on environment
const searchApiUrl = process.env.NODE_ENV === 'production'
? 'https://pricehound.tech/api/search'
: 'http://localhost:8000/api/search';

function ProductCard({ productName, productImg, price, date, setLoading }) {
  const navigate = useNavigate(); 

const handleSearch = async () => {
  setLoading(true, `Searching for ${productName}...`); // Set loading with a message

  try {
    
    const country = localStorage.getItem('selectedCountry');  

    const response = await axios.get(`${searchApiUrl}`, {
      params: {
        query: productName,
        country: country  
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
