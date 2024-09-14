import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ProductCard.css';

function WishlistCard({ productName, productImg, price, date, onRemove }) {
  const navigate = useNavigate(); // Initialize navigate hook
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    setLoading(true, `Searching for ${productName}...`); // Set loading with a message
    
    try {
      const response = await axios.get(`http://localhost:5001/api/search?query=${productName}`);
      setLoading(false); // Stop loading

      const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

      navigate('/product', { state: { searchResults: searchResults, query: productName } }); // Navigate with search results
    } catch (error) {
      console.error('Error fetching search results:', error);
      setLoading(false); // Stop loading on error
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
      const response = await axios.post('http://localhost:8000/api/wishlist/remove', formData);
      //onremove function to tell wishlist to update
      onRemove();
      console.log(response)
    }
    catch (error) {
      alert('err')
    }
  }
  return (

    <div className="product-card">
      <div onClick={handleSearch} > {/* Call handleSearch on click */}
        <div className="product-image">
          <img src={productImg} alt={productName} /> {/* Dynamically set the image source */}
        </div>
        <h3 className="product-name">{productName}</h3>
        <h3 className="product-price">{price}</h3>
        <h3 className="product-date"> as of {date}</h3>

      </div>
      <button className="remove-button" onClick={() => removeWishlist(productName)}>Remove</button>
    </div>
  );
}

export default WishlistCard;
