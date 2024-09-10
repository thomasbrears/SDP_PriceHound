import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Loading from '../components/Loading';
import '../css/SearchBarBig.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchBarBig({ onResults, sortOrder, priceRange }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();

  const searchApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://pricehound.tech/api/search'
    : 'http://localhost:5001/api/search'; 

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const isTwoValid = (query && sortOrder) || (query && priceRange) || (sortOrder && priceRange);
    const areAllValid = query && sortOrder && priceRange;

    if (areAllValid || isTwoValid) {
      handleSearch();
    }
  }, [query, sortOrder, JSON.stringify(priceRange)]);

  const handleSearch = async () => {
    setLoading(true);
    setLoadingMessage(`Searching for "${query}"...`);

    try {
      const response = await axios.get(`${searchApiUrl}`, {
        params: {
          query: query,
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
          navigate('/product', { state: { searchResults, searchQuery: query, priceRanges: fetchedPriceRanges } });
        } else {
          navigate('/search', { state: { searchResults, query, priceRanges: fetchedPriceRanges } });
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

  return (
    <div className="search-big-container">
      <div className="search-big-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a product to compare ..."
          className="search-big-input"
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