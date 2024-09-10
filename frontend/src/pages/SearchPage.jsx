import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import MainHeadTitle from '../components/MainHeadTitle';
import SearchBarBig from '../components/SearchBarBig';
import ComparisonCard from '../components/ComparisonCard';
import Loading from '../components/Loading';
import PriceRange from '../components/PriceRange'; 
import '../css/SearchPage.css'; 
import Sort from '../components/Sort';

function SearchPage() {
  const location = useLocation(); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState(''); // select one price range
  const [priceRanges, setPriceRanges] = useState([]); // show price range


  const handleSortChange = (order) => {
    setSortOrder(order);
  };
  
  const onPriceRangeClick = (range) => {
    console.log('Selected Price Range min, max:', range.min, range.max);
    const formattedRange = `selectedMinPr=${range.min}&selectedMaxPr=${range.max === Infinity ? 'Infinity' : range.max}`;
    setPriceRange(formattedRange);
    console.log("Selected Price Range:",formattedRange);
  };

  // Use useEffect to handle location changes
  useEffect(() => {
    if (location.state?.searchResults) {
      setLoading(true);
      setResults(location.state.searchResults);
      setPriceRanges(location.state.priceRanges || []); // Set priceRanges if available
      setLoading(false);
    }
  }, [location]);

  return (
    <div className="search-page">
      <MainHeadTitle 
        title="Search for your favorite products"
        subtitle="We're sniffing out and comparing over 1000 products for the best deals worldwide"
      />
      
      <div className="search-page-bar-container">
        <SearchBarBig 
          onResults={setResults} 
          sortOrder={sortOrder} 
          priceRange={priceRange}
        />
      </div>

      {loading ? (
        <Loading /> 
      ) : (
        <div className="search-page-content">
          <div className="search-page-filters-sidebar">
            <Sort onSort={handleSortChange} />
            {/* Display PriceRange component */}
            <PriceRange priceRanges={priceRanges} onPriceRangeClick={onPriceRangeClick}/>
          </div>

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