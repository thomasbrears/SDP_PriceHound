import React from 'react';
import '../css/Header.css';
import { FaSearch } from 'react-icons/fa'; 

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <img src="/images/PriceHound_Logo.png" alt="PriceHound Logo" className="logo" />
        <nav className="nav">
          <a href="/about" className="nav-link">About</a>
          <a href="/brands" className="nav-link">Brands</a>
          <a href="/categories" className="nav-link">Categories</a>
        </nav>
        <div className="search-profile">
          <div className="search-bar">
            <input type="text" placeholder="Search..." className="search-input" />
            <FaSearch className="search-icon" />
          </div>
          <img src="/images/profile.png" alt="Profile" className="profile-pic" />
        </div>
      </div>
    </header>
  );
}

export default Header;
