import React from 'react';
import { useLocation } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import PriceComparisonCard from '../components/PriceComparisonCard';
import '../css/ProductPage.css'; 

function ProductPage() {
  const location = useLocation();
  const searchResults = location.state?.searchResults || []; 
  const mainProduct = searchResults[0];

  // Filter only with a direct shop link
  const filteredResults = searchResults.filter(item => item.shopLink);

  return (
    <div className="product-page">
      <MainHeadTitle 
        title={mainProduct.title}
        subtitle={`Found at ${filteredResults.length} retailers for as low as ${mainProduct.price}`}
      />

      <div className="product-page-comparison-section">
        <h2>Let's Compare Prices</h2>
        <p>We have found this product on several retailers</p>

        {filteredResults.map((item, index) => (
          <PriceComparisonCard
            key={index}
            logo={item.shopLogo}
            retailerName={item.title}
            price={item.price}
            link={item.shopLink}
            shippingInfo={item.shippingAvailable}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductPage;
