import React from 'react';
import { useLocation } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import PriceComparisonSection from '../components/PriceComparisonSection'; 
import '../css/ProductPage.css';
import '../css/PriceComparisonCard.css';

function ProductPage() {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];
  const searchQuery = location.state?.searchQuery || ''; // Extract searchQuery from location state

  // Check if there are any results
  if (searchResults.length === 0) {
    return <div>No product information available.</div>;
  }

  const mainProduct = searchResults[0];

  // Safeguard against missing properties
  if (!mainProduct || !mainProduct.title || !mainProduct.price) {
    console.error('Incomplete product data:', mainProduct); // Log incomplete data for debugging
    return <div>Product information is incomplete or unavailable.</div>;
  }

  // Filter results to include only those with a direct shop link
  const filteredResults = searchResults.filter(item => item.shopLink);

  return (
    <div className="product-page">
      <MainHeadTitle 
        title={searchQuery} // Use the search query for the title
        subtitle={`Found ${filteredResults.length} options for as low as ${mainProduct.price}`}
      />

      {/* Product Details Section */}
      <div className="product-page-details">
        {/* Main Product Image */}
        <div className="product-page-main-image">
          <div className="product-page-image-placeholder">
            <img 
              src={mainProduct.mainImage || 'path/to/placeholder.png'}  // Updated to use mainImage
              alt={searchQuery} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="product-page-info">
          <h3>{searchQuery}</h3> {/* Use search query instead of mainProduct.title */}
          <p className="product-page-price">Lowest price found is {mainProduct.price}</p>
          <p className="product-page-description">{mainProduct.description || ''}</p>
          <ul className="product-page-additional-info">
          </ul>
        </div>
      </div>

      <PriceComparisonSection retailers={filteredResults} />
    </div>
  );
}

export default ProductPage;
