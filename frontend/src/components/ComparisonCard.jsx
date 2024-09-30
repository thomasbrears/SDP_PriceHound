import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import '../css/ComparisonCard.css';
import { storage } from '../FirebaseAuth/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { format } from 'date-fns';
import Loading from './Loading';

function ComparisonCard({
  logo,
  title,
  price,
  link,
  shippingInfo,
  deliveryTime,
  location,
  setLoading, // Receive setLoading prop
  setLoadingMessage, // Receive setLoadingMessage prop
  onAdd,

}) {
  const navigate = useNavigate(); // Initialize navigate hook
  const userInfo = JSON.parse(localStorage.getItem('user'));

// Dynamically set the search API URL based on environment
const searchApiUrl = process.env.NODE_ENV === 'production'
? 'https://pricehound.tech/api/search'
: 'http://localhost:8000/api/search';

// Function to handle search rerun
const handleSearch = async () => {
  setLoading(true); // Show loading overlay
  setLoadingMessage(`Sit tight; A hound is getting the latest prices for you...`);

  try {
    // Replace any "/" with "-" in the title
    const sanitizedTitle = title.replace(/\//g, '-');

    // Make API call to backend to run searchapi.js with the sanitized title
    const response = await axios.get(`${searchApiUrl}?query=${encodeURIComponent(sanitizedTitle)}`);

    const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

    // Navigate to product page with new search results and include search query (title)
    navigate('/product', { state: { searchResults: searchResults, searchQuery: title } });
  } catch (error) {
    console.error('Error searching for the product:', error);
  } finally {
    setLoading(false); // stop loading animation
  }
};

  //sends info on item to backend to store
  const addToWishlist = async (logo, name, price) => {
    //replace annoying characters that cause issues with spaces or - to then be sent off to firestore to store
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
      //sends a post request with all the relevant information to the backend to then be stored in the firestore databased based on the uid
      const response = await axios.post('http://localhost:8000/api/wishlist', formData);
      onAdd();
    }
    catch (error) {
      alert("error adding to wishlist");
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
        <button onClick={handleSearch} className="comparison-card-button">Compare Prices</button>
        {userInfo !== null ? <button onClick={() => addToWishlist(logo, title, price)} className="comparison-card-wishlist-button">Add to wishlist</button> : <></>}
      </div>
    </div>
  );
}

export default ComparisonCard;