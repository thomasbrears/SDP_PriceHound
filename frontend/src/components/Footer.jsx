import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';
import LogOutButton from '../components/LogOutButton';
import { ThemeContext } from '../ThemeContext';

const Footer = () => {
  // Check if the user is authenticated by checking local storage
  const isAuthenticated = localStorage.getItem('user') !== null;

  const { theme } = useContext(ThemeContext);
  const logoSrc = theme === 'light' ? 'images/PH-logo-blacktext.png' : 'images/PH-logo-whitetext.png';

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <img src={logoSrc}  alt="PriceHound Logo" className="footer-logo" />
        </div>
        {/* Footer category section with navigation links */}
        <div className="footer-category">
          <p style={{ fontSize: '10px' }}>Always double check prices before buying, we collect our prices from a variety of sources live and can't guarantee their accuracy. We are not responsible for any issues that may arise from using this site.</p>
          <div className="footer-column">
            { <ul className="footer-categories">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About Us </Link></li>
              <li><Link to="/contact " className="footer-link">Contact Us </Link></li>
              <li><Link to="/categories" className="footer-link">Browse Categories </Link></li>
              <li><Link to="/brands" className="footer-link">Browse Brands</Link></li>

               {/* Links shown only when the user is authenticated */}
             {isAuthenticated && (
              <>
              <li><Link to="/wishlist" className="footer-link">My Wishlist </Link></li>
              <li><Link to="/manage-account" className="footer-link">Manage My Account </Link></li>
              {/* Render LogOutButton for authenticated users */}
              <Link to="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none' }}>
              <LogOutButton />
              </Link>
              </>
             )}

             {/* Links shown only when the user is authenticated */}
             {!isAuthenticated && (
              <>
              <li><Link to="/login" className="footer-link">Signin </Link></li>
              <li><Link to="/signup" className="footer-link">Signup </Link></li>
              </>
             )}
            </ul> }
          </div>
          
        </div>
        <div>
          {/* Footer bottom section with copyright text */}
            <p className="footer-text">© 2024 PriceHound. All Rights Reserved.V1.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
