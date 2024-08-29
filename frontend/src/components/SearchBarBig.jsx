import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import '../css/SearchBarBig.css'; 
import axios from 'axios';

function SearchBarBig({ onResults }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    console.log('Search button clicked'); // Log when the button is clicked
    if (typeof onResults !== 'function') {
      console.error('onResults is not a function');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      console.log('Search results received:', response.data); // Log the response data
      onResults(response.data); // Call onResults with the data
    } catch (error) {
      console.error('Error searching:', error);
      onResults([]); // Pass an empty array in case of error
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
