import React from 'react';
import logo from 'frontend/public/images/PriceHound_Logo.png'; // Update the path to your logo image

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={logo} alt="PriceHound Logo" className="footer-logo" />
        </div>
        <div className="footer-right">
          <div className="footer-column">
            {/* <ul className="footer-categories">
              <li><a href="/home" className="footer-link">Home</a></li>
              <li><a href="/about" className="footer-link">About</a></li>
              <li><a href="/account" className="footer-link">My Account</a></li>
            </ul> */}
          </div>
          <div className="footer-column">
            {/* <ul className="footer-categories">
              <li><a href="/brands" className="footer-link">Brands</a></li>
              <li><a href="/categories" className="footer-link">Categories</a></li>
              <li><a href="/search" className="footer-link">Search</a></li>
            </ul> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

