import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Loading from '../components/Loading';
import '../css/SearchBarBig.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchBarBig({ onResults, sortOrder, priceRange, query }) {
  const [localQuery, setLocalQuery] = useState(query || ''); // Initialize with query prop
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();

  const searchApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://pricehound.tech/api/search'
    : 'http://localhost:5001/api/search'; 

  const handleInputChange = (e) => {
    setLocalQuery(e.target.value);
  };

  useEffect(() => {
    // Only update localQuery when query prop changes and is not an empty string
    if (query !== localQuery && query !== '') {
      setLocalQuery(query);
    }
  }, [query]);
  
  // Check if any of the search parameters are valid
  useEffect(() => {
    const isTwoValid = (localQuery && sortOrder) || (localQuery && priceRange) || (sortOrder && priceRange);
    const areAllValid = localQuery && sortOrder && priceRange;
    // If any of the search parameters are valid, perform search
    if (areAllValid || isTwoValid) {
      handleSearch();
    }
  }, [localQuery, sortOrder, JSON.stringify(priceRange)]);

  // Search for products
  const handleSearch = async () => {
    setLoading(true);
    setLoadingMessage(`Searching for "${localQuery}"...`);

    try {
      const response = await axios.get(`${searchApiUrl}`, {
        params: {
          query: localQuery,
          sort: sortOrder,
          priceRange: priceRange
        }
      });

      console.log("response is:", response);
      setLoading(false);

      const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

      if (searchResults && searchResults.length > 0) {
        const isSpecific = searchResults.some(item => item.title && item.shopLogo);
        
        if (isSpecific) {
          navigate('/product', { state: { searchResults, searchQuery: localQuery, priceRanges: fetchedPriceRanges } });
        } else {
          navigate('/search', { state: { searchResults, query: localQuery, priceRanges: fetchedPriceRanges } });
        }
      } else {
        onResults([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setLoading(false);
    }
  };

    // Handle "Enter" key press to trigger search
    const handleEnterKeySearch = (e) => {
      if (e.key === 'Enter') {
        handleSearch(); // Search when Enter key is pressed
      }
    };

  return (
    <div className="search-big-container">
      <div className="search-big-input-wrapper">
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          placeholder="Search for a product to compare ..."
          className="search-big-input"
          onKeyDown={handleEnterKeySearch}
        />
        <button onClick={handleSearch} className="search-big-button">
          <FiSearch className="search-big-icon" />
        </button>
      </div>
      {loading && <Loading message={loadingMessage} />}
    </div>
  );
}

export default SearchBarBig;