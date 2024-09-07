import React, { useState } from 'react';
import { FaSearch, FaCaretDown } from 'react-icons/fa';
import Loading from '../components/Loading'; 
import LogOutButton from '../components/LogOutButton';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(''); 
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Check if the user is authenticated based on localStorage
  const isAuthenticated = localStorage.getItem('user') !== null;

  // Dynamically set the search API URL based on environment
  const searchApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://pricehound.tech/api/search'
    : 'http://localhost:5001/api/search';

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true); // Start loading
    setLoadingMessage(`Searching for "${query}"...`); // Set the loading message with the search query

    try {
      const response = await axios.get(`http://localhost:5001/api/search?query=${query}`);
      setLoading(false); // Stop loading

      if (response.data && response.data.length > 0) {
        const isSpecific = response.data.some(
          (item) => item.title && item.shopLogo
        );

        if (isSpecific) {
          // Navigate to product page with search results and query
          navigate("/product", {
            state: { searchResults: response.data, searchQuery: query },
          });
        } else {
          navigate("/search", {
            state: { searchResults: response.data, query },
          });
        }
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error searching:", error);
      setLoading(false); // Stop loading on error
    }
  };

  // Toggle profile dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="logo-link">
          <img
            src="/images/PriceHound_Logo.png"
            alt="PriceHound Logo"
            className="logo"
          />
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
          {loading && <Loading message={loadingMessage} />} {/* Show loading with message */}
          <img src="/images/profile.png" alt="Profile" className="profile-pic" />
        </div>
      </div>
    </header>
  );
}

export default Header;
