import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaCaretDown, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import Loading from '../components/Loading';
import LogOutButton from '../components/LogOutButton';
import '../css/Header.css';
import axios from 'axios';
import { storage } from '../FirebaseAuth/Firebase';
import { getDownloadURL, ref } from 'firebase/storage'
import { ThemeContext } from '../ThemeContext';

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
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const navigate = useNavigate();

  // Check if the user is authenticated based on localStorage
  const isAuthenticated = localStorage.getItem('user') !== null;

  // Dynamically set the search API URL based on environment
  const searchApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://pricehound.tech/api/search'
    : 'http://localhost:8000/api/search';

  // Handle sign-in button click and save the current URL
  const handleSignInClick = () => {
    const currentUrl = window.location.pathname; // Capture current URL (without query params)
    sessionStorage.setItem('previousUrl', currentUrl); // Save the current URL
    navigate('/login'); // Redirect to the sign-in page
  };

  // Handle sign-in button click and save the current URL
  const handleSignupClick = () => {
    const currentUrl = window.location.pathname; // Capture current URL (without query params)
    sessionStorage.setItem('previousUrl', currentUrl); // Save the current URL
    navigate('/signup'); // Redirect to the sign-up page
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle a product search
  const handleSearch = async () => {
    setLoading(true); // Start loading
    setLoadingMessage(`Searching for "${query}"...`); // Set the loading message with the search query
  
    try {
      const country = localStorage.getItem('selectedCountry'); 

      const response = await axios.get(`${searchApiUrl}?query=${query}&country=${encodeURIComponent(country)}`);      
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
     // // Clear the query value after navigation
      setQuery('');
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

  // Close dropdown when a link is clicked
  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Open/close mobile menu
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

  const logoSrc = theme === 'light' ? 'images/PH-logo-blacktext.png' : 'images/PH-logo-whitetext.png';

  return (
    <header className={`header ${isSticky ? 'sticky' : ''} ${isHidden ? 'hidden' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo-link" onClick={closeDropdown}>
          <img src={logoSrc} alt="PriceHound Logo" className="logo" />
        </Link>
      
        {/* Desktop Navigation */}
        <nav className="nav">
          <Link to="/about" className="nav-link" onClick={closeDropdown}>About</Link>
          <Link to="/contact" className="nav-link" onClick={closeDropdown}>Contact</Link>
          <Link to="/brands" className="nav-link" onClick={closeDropdown}>Brands</Link>
          <Link to="/categories" className="nav-link" onClick={closeDropdown}>Categories</Link>
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
                  <Link to="/wishlist" className="dropdown-link" onClick={closeDropdown}>My Wishlist</Link> 
                  <Link to="/manage-account" className="dropdown-link" onClick={closeDropdown}>Manage My Account</Link> 
                  <LogOutButton />
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={handleSignInClick} className="nav-button-link">Sign in</button>
              <button onClick={handleSignupClick} className="nav-button-link">Sign up</button>
            </>
          )}

          <button onClick={toggleTheme} className="theme-toggle">{theme === 'light' ? <FaMoon /> : <FaSun />} </button>
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
            <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link>
            <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link>
            <Link to="/brands" className="nav-link" onClick={closeMobileMenu}>Brands</Link>
            <Link to="/categories" className="nav-link" onClick={closeMobileMenu}>Categories</Link>
  
            {/* Mobile account links or sign-in/up links */}
            {isAuthenticated ? (
              <div className="profile-section">
                <img src={pfp ? pfp : 'images/profile.png'} alt="Profile" className="profile-pic" />
                <Link to="/wishlist" className="nav-link" onClick={closeMobileMenu}>My Wishlist</Link>
                <Link to="/manage-account" className="nav-link" onClick={closeMobileMenu}>Manage My Account</Link>
                <LogOutButton />
              </div>
            ) : (
              <div className="mobile-auth-links">
                <button 
                  onClick={() => {
                    const currentUrl = window.location.pathname; // Save the current URL
                    sessionStorage.setItem('previousUrl', currentUrl); // Store it
                    closeMobileMenu(); // Close the mobile menu
                    navigate('/login'); // Redirect to login page
                  }} 
                  className="nav-button-link"
                >Sign in</button>
                <button 
                  onClick={() => {
                    const currentUrl = window.location.pathname; // Save the current URL
                    sessionStorage.setItem('previousUrl', currentUrl); // Store it
                    closeMobileMenu(); // Close the mobile menu
                    navigate('/signup'); // Redirect to sign-up page
                  }} 
                  className="nav-button-link"
                  >Sign up</button>
              </div>
            )}

            <button onClick={toggleTheme} className="theme-toggle" id='test'>{theme === 'light' ? <FaMoon /> : <FaSun />} </button>
          </nav>
        )}
      </div>
    </header>
  );
}  

export default Header;