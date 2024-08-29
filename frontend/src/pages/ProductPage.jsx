import React from 'react';
import { useLocation } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import PriceComparisonCard from '../components/PriceComparisonCard';
import '../css/ProductPage.css'; 

function ProductPage() {
  const location = useLocation();

  // Retrieve the search term from the query parameters
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('query') || 'Product'; 

  const searchResults = location.state?.searchResults || []; 
  const mainProduct = searchResults[0];

  return (
    <div className="product-page">
      <MainHeadTitle 
        title={searchTerm} 
        subtitle={`Found at ${searchResults.length} retailers for as low as ${mainProduct?.price || 'N/A'}`}
      />

      <div className="product-page-comparison-section">
        <h2>Let's Compare Prices</h2>
        <p>We have found this product on several retailers</p>

        {searchResults.map((item, index) => (
          <PriceComparisonCard
            key={index}
            logo={item.shopLogo}
            retailerName={item.title}
            price={item.price}
            link={item.productLink || '#'}
            shippingInfo={item.shippingAvailable}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductPage;


  /*
  // Calculate the price range and tagline dynamically
  const prices = product.retailers.map(retailer => retailer.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

  const countries = [...new Set(product.retailers.map(retailer => retailer.location))];
  const tagline = `Found at ${product.retailers.length} retailers from ${countries.length} ${countries.length > 1 ? 'countries' : 'country'} for as low as $${minPrice.toFixed(2)}`;

  return (
    <div className="product-page">
      <ProductFeaturedSection name={product.name} tagline={tagline} />
      <Breadcrumb category={product.category} subCategory={product.subCategory} name={product.name} />
      <div className="product-details">
        <ProductImages images={product.images} name={product.name} />
        <ProductInfo 
          name={product.name} 
          priceRange={priceRange} 
          rating={4} 
          ratingCount={5} 
          description={product.description} 
        />
      </div>
      <PriceComparisonSection retailers={product.retailers} />
    </div>
  );
}; */
