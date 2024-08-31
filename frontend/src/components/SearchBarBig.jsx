import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import '../css/SearchBarBig.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchBarBig({ onResults }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    console.log('Search button clicked'); 
    if (typeof onResults !== 'function') {
      console.error('onResults is not a function');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      console.log('Search results received:', response.data);

      // Check if specific search
      if (response.data && response.data.length > 0) {
        const isSpecific = response.data.some(item => item.title && item.shopLogo);
        
        if (isSpecific) {
          // Navigate to the /product page with state if specific search
          navigate('/product', { state: { searchResults: response.data } });
        } else {
          // Navigate to the /search page with state if broad search
          navigate('/search', { state: { searchResults: response.data, query } });
        }
      } else {
        // No results, pass empty results to onResults if provided
        onResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      onResults([]);
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
    </div>
  );
}

export default SearchBarBig;
