import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; 
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests

function Header() {
  const [query, setQuery] = useState(''); // State to manage the search query
  const navigate = useNavigate(); // Initialize navigate hook

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle search logic
  const handleSearch = async () => {
    console.log('Search button clicked'); 

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
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="logo-link">
          <img src="/images/PriceHound_Logo.png" alt="PriceHound Logo" className="logo" /> 
        </a>
        <nav className="nav">
          <a href="/about" className="nav-link">About</a>
          <a href="/brands" className="nav-link">Brands</a>
          <a href="/categories" className="nav-link">Categories</a>
        </nav>
        <div className="search-profile">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input" 
              value={query}
              onChange={handleInputChange} 
            />
            <FaSearch className="search-icon" onClick={handleSearch} />
          </div>
          <img src="/images/profile.png" alt="Profile" className="profile-pic" />
        </div>
      </div>
    </header>
  );
}

export default Header;
