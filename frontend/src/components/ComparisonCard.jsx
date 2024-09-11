import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import '../css/ComparisonCard.css';
import { storage } from '../FirebaseAuth/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { format } from 'date-fns';

function ComparisonCard({
  logo,
  title,
  price,
  link,
  shippingInfo,
  deliveryTime,
  location,
  onAdd,

}) {
  const navigate = useNavigate(); // Initialize navigate hook
  const userInfo = JSON.parse(localStorage.getItem('user'));

  // Function to handle search rerun
  const handleSearch = async () => {
    try {

      const sanitizedTitle = title.replace(/\//g, '-');

      // Make API call to backend to run searchapi.js with the sanitized title
      const response = await axios.get(`http://localhost:5001/api/search?query=${encodeURIComponent(sanitizedTitle)}`);

      const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

      // Navigate to product page with new search results
      navigate('/product', { state: { searchResults: searchResults } });
    } catch (error) {
      console.error('Error searching for the product:', error);
    }
  };

  //sends info on item to backend to store
  const addToWishlist = async (logo, name, price) => {
    const sanitizedTitle = name.replace(/\//g, '-');
    const modifiedString = sanitizedTitle.replace(/\./g, ' ');
    //collects date as a time stamp
    const datenow = new Date();
    const date = format(datenow, 'eeee, MMMM d, yyyy');
    try {
      const uid = userInfo.uid;
      const formData = {
        uid,
        name: modifiedString,
        price,
        logo,
        date,
      };
      const response = await axios.post('http://localhost:8000/api/wishlist', formData);
      onAdd();
    }
    catch (error) {
      alert("errrrrrr")
    }
  }

  return (
    <div className="comparison-card">
      {logo && (
        <div className="comparison-card-logo">
          <img
            src={logo}
            alt={`${title} logo`}
            onError={(e) => e.target.src = '/path/to/placeholder-image.jpg'}
          />
        </div>
      )}

      <div className="comparison-card-info">
        <h4 className="comparison-card-title">{title}</h4>
        <p className="comparison-card-subtext">
          {shippingInfo && <span>{shippingInfo}</span>}
          {deliveryTime && <span>{deliveryTime}</span>}
          {location && <span>{location}</span>}
        </p>
      </div>


      <h3 className="comparison-card-price">{price}</h3>
      { /* rerun search with the product name */}
      <div className="comparison-card-price-action">
        <button onClick={handleSearch} className="comparison-card-button">Buy Now</button>
        {userInfo !== null ? <button onClick={() => addToWishlist(logo, title, price)} className="comparison-card-wishlist-button">Add to wishlist</button> : <></>}
      </div>
    </div>
  );
}

export default ComparisonCard;