import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import PriceComparisonSection from '../components/PriceComparisonSection'; 
import Message from '../components/Message';
import ReviewSection from '../components/ReviewSection';
import axios from 'axios'; 
import '../css/ProductPage.css';
import '../css/PriceComparisonCard.css';

function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(null);
  const [messageInfo, setMessageInfo] = useState({ message: '', type: '' });  
  const [averageRating, setAverageRating] = useState(0);
  const searchResults = location.state?.searchResults || [];
  const searchQuery = location.state?.searchQuery || ''; // Extract searchQuery from location state
  const [user, setUser] = useState(null); // Store user info

  // Function to handle average rating update
  const handleAverageRatingUpdate = (newAverageRating) => {
    setAverageRating(newAverageRating);
  };

  // Redirect if no search results
  useEffect(() => {
    if (searchResults.length === 0) {
      navigate('/product-not-found');
    }
  }, [searchResults, navigate]);
  
  // main product object
  const mainProduct = searchResults[0] || {};

  // Set main image if available
  useEffect(() => {
    if (mainProduct.mainImage) {
      setMainImage(mainProduct.mainImage);
    }
  }, [mainProduct.mainImage]);

  // Check for incomplete product data and set error message
  useEffect(() => {
    if (!mainProduct.title || !mainProduct.price) {
      setMessageInfo({ message: 'Product information is incomplete or unavailable.', type: 'error' });
    }
  }, [mainProduct.title, mainProduct.price]);

  // Filter results to include only those with a direct shop link
  const filteredResults = searchResults.filter(item => item.shopLink);

  // Handle image click to set main image
  const handleImageClick = (image) => {
    setMainImage(image);
  };

  // Google AdSense
  useEffect(() => {
    // Ensure window.adsbygoogle exists before pushing ads
    if (window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  // Check if user is logged in from local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser); // Set user info from local storage
    }
  }, []);

  return (
    <div className="product-page">
      {messageInfo.message && <Message key={Date.now()} message={messageInfo.message} type={messageInfo.type} />} 

      {/* Main Header Title */}
      <MainHeadTitle 
        title={searchQuery}
        subtitle={`Found ${filteredResults.length} options for as low as ${mainProduct.price}`}
      />

      {/* TODO: Add back Breadcrumbs */}

      {/* Product Details Section */}
      <div className="product-page-details">
            {/* Main Product Image */}
            <div className="product-page-main-image">
              <div className="product-page-image-placeholder">
                <img 
                  src={mainImage || 'images/image-unavailable.jpg'} // Fallback to placeholder if no main image
                  alt={searchQuery} 
                />
              </div>
            </div>

            {/* Additional Product Images */}
            {mainProduct.images && mainProduct.images.length > 1 && (
              <div className="additional-images">
                {mainProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${mainProduct.title} ${index + 1}`}
                    onClick={() => handleImageClick(image)}
                    className={`thumbnail ${image === mainImage ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}

            {/* Product Info */}
            <div className="product-page-info">
              <h3>{searchQuery}</h3>
              <div className="price-rating-container">
              <span className="product-page-price">Found for as low as {`${mainProduct.price}`}</span>
              </div>
              <hr />
              <span className="product-page-rating">The products average rating is {averageRating} / 5 </span>
              <br />
              <p className="product-page-description">{mainProduct.description || ''}</p> {/* Leave description blank if unavailable */}
            </div>
          </div>

      {/* Price Comparison Section */}
      <PriceComparisonSection retailers={filteredResults} />

      {/* Rating and Review Section */}
      <ReviewSection 
        searchQuery={searchQuery} 
        mainProduct={mainProduct} 
        user={user} 
        onAverageRatingUpdate={handleAverageRatingUpdate}
      />

      {/* Google Adsense Section */}
      <div className="ad-section">
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1301948966347874"
          data-ad-slot="6032252070"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <p className="ad-label">Advertisement</p>
      </div>
    </div>
  );
}

export default ProductPage;
