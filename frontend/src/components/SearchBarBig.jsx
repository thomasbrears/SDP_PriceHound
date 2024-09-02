import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Loading from '../components/Loading';
import '../css/SearchBarBig.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchBarBig({ onResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true); // Start loading
    setLoadingMessage(`Searching for "${query}"...`); // Set the loading message with the search query

    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      setLoading(false); // Stop loading

      if (response.data && response.data.length > 0) {
        const isSpecific = response.data.some(item => item.title && item.shopLogo);
        
        if (isSpecific) {
          navigate('/product', { state: { searchResults: response.data } });
        } else {
          navigate('/search', { state: { searchResults: response.data, query } });
        }
      } else {
        onResults([]);
        setLoading(false); // Stop loading if no results
      }
    } catch (error) {
      console.error('Error searching:', error);
      setLoading(false); // Stop loading on error
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
      {loading && <Loading message={loadingMessage} />} {/* Show loading icon with message */}
    </div>
  );
}

export default SearchBarBig;
