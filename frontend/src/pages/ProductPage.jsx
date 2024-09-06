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

  // Filter results to include only those with a direct shop link
  const filteredResults = searchResults.filter(item => item.shopLink);

  return (
    <div className="product-page">
      <MainHeadTitle 
        title={searchQuery} // Use the search query for the title
        subtitle={`Found at ${filteredResults.length} retailers for as low as ${mainProduct.price}`}
      />

      <PriceComparisonSection retailers={filteredResults} />
    </div>
  );
}

export default ProductPage;
