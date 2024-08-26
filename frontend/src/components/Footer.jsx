import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <img src="images/PriceHound_Logo.png"  alt="PriceHound Logo" className="footer-logo" />
        </div>
        <div className="footer-category">
          <div className="footer-column">
            { <ul className="footer-categories">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/about" className="footer-link">About Us </a></li>
              <li><a href="/contact " className="footer-link">Contact Us </a></li>
              <li><a href="/categories" className="footer-link">Browse Categories </a></li>
              <li><a href="/brands" className="footer-link">Browse Brand</a></li>
              <li><a href="/wishlist" className="footer-link">My Wishlist </a></li>
              <li><a href="/manage-account" className="footer-link">Manage My Account </a></li>
              <li><a href="/login" className="footer-link">Login </a></li>
            
            </ul> }
          </div>
          
        </div>
        <div>
            <p className="footer-text">© 2024 PriceHound. All Rights Reserved.V1.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;