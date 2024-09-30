import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ProductCard.css';
import Message from './Message';
import Loading from './Loading';

function WishlistCard({ productName, productImg, price, date, onRemove }) {
  const navigate = useNavigate(); // Initialize navigate hook
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [messageInfo, setMessageInfo] = useState({ message: '', type: '' }); // State for managing success/error messages
  
  // Dynamically determine the APIs URL based on environment
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://pricehound.tech/api'
    : 'http://localhost:8000/api';

    const handleSearch = async () => {
      setLoading(true); 
      setLoadingMessage(`Sit back; We've got a Hound on it, searching the web for the latest prices`);
      
      try {        
        // Perform search API call
        const response = await axios.get(`${apiUrl}/search?query=${encodeURIComponent(productName)}`);
        const { searchResults } = response.data;
    
        // Check if searchResults have required data, otherwise set an error message
        if (searchResults && searchResults.length > 0) {
          navigate('/product', { state: { searchResults: searchResults, searchQuery: productName } }); // Navigate to product page
        } else {
          setMessageInfo({ message: 'No products found for this search.', type: 'error' });
        }
    
      } catch (error) {
        setMessageInfo({ message: 'Error fetching search results', type: 'error' });
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false); // Stop loading animation
      }
    };    

  //function for removing items from the wishlist, sends info back to the wishlist page to then update using onRemove();
  const removeWishlist = async (name) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const sanitizedTitle = name.replace(/\//g, '-');
    const modifiedString = sanitizedTitle.replace(/\./g, ' ');
    //replace characters like . and / due to errors caused by them then sending this info off to the backend to be removed from the database
    const formData = {
      uid: storedUser.uid,
      itemName: modifiedString
    };
    try {
      const response = await axios.post(`${apiUrl}/remove`, formData);
      //onremove function to tell wishlist to update
      onRemove();
      setMessageInfo({ message: 'Item removed from wishlist.', type: 'success' });
      console.log(response)
    }
    catch (error) {
      setMessageInfo({ message: 'Error removing item from wishlist.', type: 'error' });
      console.error('Error removing item from wishlist:', error);
    }
  }
  return (

    <div className="product-card">
      {loading && <Loading message={loadingMessage} />}
      <div onClick={handleSearch} > {/* Call handleSearch on click */}
        <div className="product-image">
          <img src={productImg} alt={productName} /> {/* Dynamically set the image source */}
        </div>
        <h3 className="product-name">{productName}</h3>
        <h3 className="product-price">{price}</h3>
        <h3 className="product-date"> as of {date}</h3>

      </div>
      <button className="removeButton" onClick={() => removeWishlist(productName)}>Remove</button>
      <button className="viewProduct" onClick={handleSearch}>View Product</button>
    </div>
  );
}

export default WishlistCard;
