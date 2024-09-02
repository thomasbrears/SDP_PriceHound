import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import MainHeadTitle from '../components/MainHeadTitle';
import SearchBarBig from '../components/SearchBarBig';
import ComparisonCard from '../components/ComparisonCard';
import Loading from '../components/Loading';
import '../css/SearchPage.css'; 

function SearchPage() {
  const location = useLocation(); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use useEffect to handle location changes
  useEffect(() => {
    if (location.state?.searchResults) {
      setLoading(true); // Start loading when location changes
      setResults(location.state.searchResults); // Update results with new search results
      setLoading(false); // Stop loading once results are set
    }
  }, [location]);

  return (
    <div className="search-page">
      <MainHeadTitle 
        title="Search for your favorite products"
        subtitle="We're sniffing out and comparing over 1000 products for the best deals worldwide"
      />
      
      <div className="search-page-bar-container">
        <SearchBarBig onResults={setResults} />
      </div>

      {loading ? (
        <Loading /> // Display the loading component when loading is true
      ) : (
        <div className="search-page-content">
          {/* Filters Sidebar */}
          <div className="search-page-filters-sidebar">
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
      )}
    </div>
  );
}

export default SearchPage;
