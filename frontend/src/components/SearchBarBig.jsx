import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import '../css/SearchBarBig.css'; 

function SearchBarBig({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a product to compare ..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          <FiSearch className="search-icon" />
        </button>
      </div>
    </div>
  );
}

export default SearchBarBig;
