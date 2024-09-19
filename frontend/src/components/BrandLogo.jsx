import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../css/BrandLogo.css';

function BrandLogo({ src, alt, setLoading }) {
  const navigate = useNavigate();

  // Function to handle search brand
  const handleSearch = async () => {
    setLoading(true, `Searching for ${alt}...`); // Brand taken from alt text

    try {
      const response = await axios.get(`http://localhost:5001/api/search`, {
        params: { query: alt } // Use the alt text as search query
      });
    
      const { searchResults, priceRanges: fetchedPriceRanges } = response.data;
      
      setLoading(false); 

      if (searchResults && searchResults.length > 0) {
        const isSpecific = searchResults.some(item => item.title && item.shopLogo);

        if (isSpecific) {
          navigate('/product', { state: { searchResults } });
        } else {
          navigate('/search', { state: { searchResults, query: alt } });
        }
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error searching for the brand:', error);
      setLoading(false); 
    }
  };

  return (
    <div className="brand-logo" onClick={handleSearch}>
      <img src={src} alt={alt} />
    </div>
  );
}

export default BrandLogo;