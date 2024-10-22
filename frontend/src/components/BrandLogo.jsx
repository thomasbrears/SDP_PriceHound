import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; // Import axios
import '../css/BrandLogo.css';

// Dynamically set the search API URL based on environment
const searchApiUrl = process.env.NODE_ENV === 'production'
  ? 'https://pricehound.tech/api/search'
  : 'http://localhost:8000/api/search';

function BrandLogo({ src, alt, setLoading }) {
  const navigate = useNavigate();

  // Function to handle brand search
  const handleSearch = async () => {
    setLoading(true, `Searching for ${alt}...`); // Set loading state, with the brand name (alt)

    try {
      const country = localStorage.getItem('selectedCountry'); // Optional country selection

      // Make the API request using axios
      const response = await axios.get(`${searchApiUrl}`, {
        params: {
          query: alt, // Use the alt text as the search query (brand name)
        }
      });

      setLoading(false); // Turn off loading state
      const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

      if (searchResults && searchResults.length > 0) {
        // Check if the search results contain specific products
        const isSpecific = searchResults.some(item => item.title && item.shopLogo);

        // Navigate to product page or search results page based on results
        if (isSpecific) {
          navigate('/product', { state: { searchResults, searchQuery: alt, priceRanges: fetchedPriceRanges } });
        } else {
          navigate('/search', { state: { searchResults, query: alt, priceRanges: fetchedPriceRanges } });
        }
      } else {
        console.log('No results found for the brand.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error searching for the brand:', error);
      setLoading(false);
    }
  };

  return (
    <div className="brand-logo" onClick={handleSearch}>
      <img src={src} alt={alt} /> {/* Brand logo image */}
    </div>
  );
}

export default BrandLogo;
