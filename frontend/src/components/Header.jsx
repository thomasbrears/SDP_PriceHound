import React, { useState, useEffect } from 'react';
import { FaSearch, FaCaretDown, FaBars, FaTimes } from 'react-icons/fa';
import Loading from '../components/Loading';
import LogOutButton from '../components/LogOutButton';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { storage } from '../FirebaseAuth/Firebase';
import { getDownloadURL, ref } from 'firebase/storage'


function Header() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [pfp, setPfp] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu visibility
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

  // Handle a product search
  const handleSearch = async () => {
    setLoading(true); // Start loading
    setLoadingMessage(`Searching for "${query}"...`); // Set the loading message with the search query

    try {
      const response = await axios.get(`${searchApiUrl}?query=${query}`);
      setLoading(false); // Stop loading

      const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

      if (searchResults && searchResults.length > 0) {
        const isSpecific = searchResults.some(item => item.title && item.shopLogo);
        
        if (isSpecific) {
          navigate('/product', { state: { searchResults, searchQuery: query, priceRanges: fetchedPriceRanges } });
        } else {
          navigate('/search', { state: { searchResults, query, priceRanges: fetchedPriceRanges } });
        }
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error searching:", error);
      setLoading(false); // Stop loading on error
      setLoadingMessage("An error occurred while searching. Please try again.");
    }
  };

  // Handle "Enter" key press to trigger search
  const handleEnterKeySearch = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Search when Enter key is pressed
    }
  };

  // Toggle profile dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Open/close mobile menu
  };

  // Profile picture from cookie
  const url = localStorage.getItem('icon');
  // Handle scroll behavior for sticky and hidden header
  useEffect(() => {
    const url = localStorage.getItem('icon');
    if (url) {
      setPfp(url);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsSticky(currentScrollY > 50);
      setIsHidden(currentScrollY > lastScrollY && currentScrollY > 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`header ${isSticky ? 'sticky' : ''} ${isHidden ? 'hidden' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <a href="/" className="logo-link">
          <img src="images/PriceHound_Logo.png" alt="PriceHound Logo" className="logo" />
        </a>

        {/* Desktop Navigation */}
        <nav className="nav">
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
          <a href="/brands" className="nav-link">Brands</a>
          <a href="/categories" className="nav-link">Categories</a>
        </nav>

        {/* Search Bar and Profile Section for Desktop */}
        <div className="search-profile">
          {/* Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleEnterKeySearch}
            />
            <FaSearch className="search-icon" onClick={handleSearch} />
          </div>

          {loading && <Loading message={loadingMessage} />}

          {/* Profile dropdown and links */}
          {isAuthenticated ? (
            <div className="profile-dropdown-wrapper">
              <div className="profile-section" onClick={toggleDropdown}>
                <img src={pfp ? pfp : 'images/profile.png'} alt="Profile" className="profile-pic" />
                <FaCaretDown className="dropdown-icon" />
              </div>
              {showDropdown && (
                <div className="profile-dropdown">
                  <a href="/wishlist" className="dropdown-link">My Wishlist</a>
                  <a href="/manage-account" className="dropdown-link">Manage My Account</a>
                  <LogOutButton />
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login" className="nav-link">Sign in</a>
              <a href="/signup" className="nav-link">Sign up</a>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className={`nav ${isMobileMenuOpen ? 'open' : ''}`}>
            {/* Search Bar inside mobile menu */}
            <div className="search-bar-mobile">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleEnterKeySearch}
              />
              <FaSearch className="search-icon" onClick={handleSearch} />
            </div>

            {/* Mobile nav links */}
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
            <a href="/brands" className="nav-link">Brands</a>
            <a href="/categories" className="nav-link">Categories</a>

            {/* Mobile account links or sign-in/up links */}
            {isAuthenticated ? (
              <div className="profile-section">
                <img src={pfp ? pfp : 'images/profile.png'} alt="Profile" className="profile-pic" />
                <a href="/wishlist" className="nav-link">My Wishlist</a>
                <a href="/manage-account" className="nav-link">Manage My Account</a>
                <LogOutButton />
              </div>
            ) : (
              <div className="mobile-auth-links">
                <a href="/login" className="nav-link">Sign in</a>
                <a href="/signup" className="nav-link">Sign up</a>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;