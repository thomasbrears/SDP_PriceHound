import React , { useEffect, useState }from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';
import { auth } from '../FirebaseAuth/Firebase.js'; 
import { onAuthStateChanged } from 'firebase/auth';

const Footer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe(); 
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <img src="images/PriceHound_Logo.png"  alt="PriceHound Logo" className="footer-logo" />
        </div>
        <div className="footer-category">
          <div className="footer-column">
            { <ul className="footer-categories">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About Us </Link></li>
              <li><Link to="/contact " className="footer-link">Contact Us </Link></li>
              <li><Link to="/categories" className="footer-link">Browse Categories </Link></li>
              <li><Link to="/brands" className="footer-link">Browse Brand</Link></li>
             {isAuthenticated && <li><Link to="/wishlist" className="footer-link">My Wishlist </Link></li>}
             {isAuthenticated && <li><Link to="/manage-account" className="footer-link">Manage My Account </Link></li>}
              <li><Link to="/login" className="footer-link">Login </Link></li>
            
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