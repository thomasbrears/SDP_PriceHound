import React, { useState } from 'react';
import MainHeadTitle from '../components/MainHeadTitle';
import SearchBarBig from '../components/SearchBarBig';
import ComparisonCard from '../components/ComparisonCard';
import '../css/SearchPage.css'; 

function SearchPage() {
  const [results, setResults] = useState([]);

  const handleSearchResults = (searchResults) => {
    setResults(searchResults);
  };

  return (
    <div className="search-page">
      <MainHeadTitle 
        title="Search for your favorite products"
        subtitle="We're sniffing out and comparing over 1000 products for the best deals worldwide"
      />
      
      <div className="search-page-bar-container">
        <SearchBarBig onResults={handleSearchResults} />
      </div>

      <div className="search-page-content">
        {/* Filters Sidebar */}
        <div className="search-page-filters-sidebar">
          {/* Placeholder for filters */}
          <h4>Sort by</h4>
          {/* Additional filter elements */}
        </div>

        {/* Products Grid Section */}
        <div className="search-page-products-grid">
          <h3>Results</h3>
          {results.length > 0 ? (
            results.map((item, index) => (
              <ComparisonCard
                key={index}
                logo={item.image}
                title={item.name}
                price={item.price}
                link={item.compareLink}
                shippingInfo={item.shippingAvailable}
              />
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}



export default SearchPage;
