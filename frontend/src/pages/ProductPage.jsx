import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import PriceComparisonSection from '../components/PriceComparisonSection';
import { toast } from 'react-toastify'; // Toastify success/error/info messages
import ReviewSection from '../components/ReviewSection';
import axios from 'axios';
import '../pages/css/ProductPage.css';
import '../css/PriceComparisonCard.css';
import ChangeCurrency from '../components/ChangeCurrency';

function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [results, setResults] = useState([]);
  const searchQuery = location.state?.searchQuery || ''; // Extract searchQuery from location state
  const [user, setUser] = useState(null); // Store user info
  const searchResults = location.state?.searchResults || [];
  const [mainProductPrice, setMainProductPrice] = useState();
  // Function to handle average rating update
  const handleAverageRatingUpdate = (newAverageRating) => {
    setAverageRating(newAverageRating);
  };

  useEffect(() => {
    const updatedResults = location.state.searchResults.map((item) => {
      const priceNumber = item.price ? parseFloat(item.price.replace(/[$,]/g, '')) : 1;
      
      const country = localStorage.getItem('selectedCountry');
      
      var symbol = "$";
      let currencyUnit = "NZD"; 
      if (country === 'AU') {
        currencyUnit = "AUD";
      }
      
      const convertedPrice = priceNumber * 1; 
      return {
        ...item,
        price: `${symbol}${convertedPrice.toFixed(2)} ${currencyUnit}`
      };
    });
    
    setResults(updatedResults);
    setMainProductPrice(mainProduct.price);
    
    if (searchResults.length === 0) {
      navigate('/product-not-found');
      toast.error('Sorry, we couldn\'t find that product. Please try again', { autoClose: 3000, position: 'top-right' }); 
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
      toast.error('Sorry, the product information is incomplete or unavailable. Please try searching again');
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

  const changeCurrency = async (newCurrency, curShort) => {
    //const curShort = JSON.parse(localStorage.getItem('cur-short'));
    const updatedResults = location.state.searchResults.map((item) => {

      const priceNumber = item.price ? parseFloat(item.price.replace(/[$,]/g, '')) : 1;

      //\u20AC - euro
      var symbol = "";
      if (curShort.localeCompare("eur") === 0) {
        symbol = "\u20AC"
      }
      else {
        symbol = "$"
      }

      const convertedPrice = priceNumber * newCurrency;

      return {
        ...item,
        price: `${symbol}${convertedPrice.toFixed(2)} ${curShort}`
      };
    });
    setResults(updatedResults)
    const mainProductP = updatedResults[0] || {};
    setMainProductPrice(mainProductP.price);
  }
  return (
    <div className="product-page">

      {/* Main Header Title */}
      <MainHeadTitle
        title={searchQuery}
        subtitle={`Found ${searchResults.length} options for as low as ${mainProductPrice}`}
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
            <span className="product-page-price">Found for as low as {`${mainProductPrice}`}</span>
          </div>
          <hr />
          <span className="product-page-rating">
            {averageRating > 0
              ? `The product's average rating is ${averageRating} / 5`
              : 'No one has reviewed this product yet. Be the first to review it below!'}
          </span>
          <br />
          <p className="product-page-description">{mainProduct.description || ''}</p> {/* Leave description blank if unavailable */}
        </div>
      </div>
      <div className='currency-center'>
        <div className='currency-div'>
          <ChangeCurrency className="change-currency"
            onChange={changeCurrency}
          />
        </div>
      </div>
      {/* Price Comparison Section */}
      <PriceComparisonSection retailers={results} />

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
