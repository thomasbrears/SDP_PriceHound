import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import SearchBarBig from '../components/SearchBarBig';
import ComparisonCard from '../components/ComparisonCard';
import Loading from '../components/Loading';
import PriceRange from '../components/PriceRange';
import '../css/SearchPage.css';
import Sort from '../components/Sort';
import Message from '../components/Message';

function SearchPage() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState(''); // select one price range
  const [priceRanges, setPriceRanges] = useState([]); // show price range
  const [query, setQuery] = useState(''); // header query state
  const [message, setMessage] = useState({ message: '', type: '' });

   // New state for handling mobile modal
   const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const onPriceRangeClick = (range) => {
    console.log('Selected Price Range min, max:', range.min, range.max);
    const formattedRange = `selectedMinPr=${range.min}&selectedMaxPr=${range.max === Infinity ? 'Infinity' : range.max}`;
    setPriceRange(formattedRange);
    console.log("Selected Price Range:", formattedRange);
  };

  // Use useEffect to handle location changes
  useEffect(() => {
    if (location.state?.searchResults) {
      setLoading(true);
      setResults(location.state.searchResults);
      setPriceRanges(location.state.priceRanges || []); // Set priceRanges if available
      setQuery(location.state.query || ''); // Set query if available
      setLoading(false);
    }
  }, [location]);

//function to display a relevant message when an item is added to the wishlist
  const displayMessage = (messageText, type = 'success') => {
    setMessage({ message: messageText, type });
    setTimeout(() => {
      setMessage({ message: '', type: '' });
    }, 3000);
  };

  // Function to toggle the mobile filter modal
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };


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
          query={query} // Pass query to SearchBarBig
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="search-page-content">
          {/* Sidebar */}
      <div className={`search-page-filters-sidebar ${isSidebarVisible ? 'visible' : ''}`}>
        {/* Close button for small screens */}
        <button className="close-button" onClick={closeSidebar}>×</button>
            <Sort onSort={handleSortChange} />
            {/* Display PriceRange component */}
            <PriceRange priceRanges={priceRanges} onPriceRangeClick={onPriceRangeClick} />
          </div>
           {/* Main content */}
          < div className="search-page-products-grid">
             {/* Results header with button only on small screens */}
            <div className="results-header">
              <h4>Results</h4>
             {/* Filter button only for small screens */}
             <button className="filter-button" onClick={toggleSidebar}>
                Filters
              </button>
            </div>
            {/* Product listing */}
            {results.length > 0 ? (
              results.map((item, index) => (
                <ComparisonCard
                  key={index}
                  logo={item.image}
                  title={item.name}
                  price={item.price}
                  link={item.compareLink}
                  shippingInfo={item.shippingAvailable}
                  onAdd={() => { displayMessage('This item has been successfully added to your wishlist!') }}
                />
              ))
            ) : (
              <p>No results found</p>
            )}
            </div>
          </div>
        )}
  
        
      {message.message && <Message message={message.message} type={message.type} />}
    </div>
  );
}

export default SearchPage;