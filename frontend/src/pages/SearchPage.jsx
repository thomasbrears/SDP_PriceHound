import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import SearchBarBig from '../components/SearchBarBig';
import ComparisonCard from '../components/ComparisonCard';
import Loading from '../components/Loading';
import PriceRange from '../components/PriceRange';
import '../pages/css/SearchPage.css';
import Sort from '../components/Sort';
import { toast } from 'react-toastify'; // Toastify success/error/info messages
import ChangeCurrency from '../components/ChangeCurrency';
import axios from 'axios';
function SearchPage() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState(''); // select one price range
  const [priceRanges, setPriceRanges] = useState([]); // show price range
  const [query, setQuery] = useState(''); // header query state
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);// state for handling mobile modal
  const [currency, setCurrency] = useState([]);
  // const [currency, setCurrency] = useState(''); 
  // const [conversionRate, setConversionRate] = useState(1);
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const onPriceRangeClick = (range) => {
    console.log('Selected Price Range min, max:', range.min, range.max);
    const formattedRange = `selectedMinPr=${range.min}&selectedMaxPr=${range.max === Infinity ? 'Infinity' : range.max}`;
    setPriceRange(formattedRange);
    console.log("Selected Price Range:", formattedRange);
    toast.success(`Price range updated to ${range.min} - ${range.max === Infinity ? 'Infinity' : range.max}`, { position: 'top-right' });
  };

  useEffect(() => {
    const fetchUpdatedResults = async () => {
      if (location.state?.searchResults) {
        setResults(location.state.searchResults);
        setPriceRanges(location.state.priceRanges || []);
        setQuery(location.state.query || '');
  
        const pricesArray = location.state.searchResults.map(item => parseFloat(item.price.replace(/[$,]/g, '')));
        setCurrency(pricesArray);
        console.log(pricesArray);
  
        const updatedResults = await Promise.all(
          location.state.searchResults.map(async (item) => {
            const cur = parseFloat(item.price.replace(/[$,]/g, ''));
  
            const country = localStorage.getItem('selectedCountry');
            let convertedPrice = cur;
            let symbol = "$";
            let currencyUnit = "NZD";
  
            if (country === 'AU') {
              currencyUnit = "AUD";
              const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/nzd.json';
              try {
                const response = await axios.get(API_URL);
                convertedPrice = cur * response.data['nzd']['aud'];
              } catch (e) {
                console.error("Error fetching currency data:", e);
              }
            }
  
            return {
              ...item,
              price: `${symbol}${convertedPrice.toFixed(2)} ${currencyUnit}`
            };
          })
        );
  
        setResults(updatedResults); // Update state with the new results
      }
    };
  
    fetchUpdatedResults();
  }, [location.state]);

  //function to display a relevant message when an item is added to the wishlist
  const displayMessage = (messageText, type = 'success') => {
    toast[type](messageText);
    setTimeout(() => {
    }, 3000);
  };

  // Function to toggle the mobile filter modal
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };
  // Function to handle currency change
  const changeCurrency = async (newCurrency, curShort) => {
    //const curShort = JSON.parse(localStorage.getItem('cur-short'));
    console.log(currency)
    const updatedResults = location.state.searchResults.map((item, index) => {
      const originalPrice = currency[index];
      //\u20AC - euro
      var symbol = "";
      if (curShort.localeCompare("EUR") === 0) {
        symbol = "\u20AC"
      }
      else {
        symbol = "$"
      }
      const convertedPrice = originalPrice * newCurrency;
      return {
        ...item,
        price: `${symbol}${convertedPrice.toFixed(2)} ${curShort}`
      };
    });
    setResults(updatedResults)

  }

  return (
    <div className="search-page">
      {loading && <Loading message={loadingMessage} />}

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

      <div className="search-page-content">
        {/* Sidebar */}
        <div className={`search-page-filters-sidebar ${isSidebarVisible ? 'visible' : ''}`}>
          {/* Close button for small screens */}
          <button className="close-button" onClick={closeSidebar}>×</button>
          <Sort onSort={handleSortChange} />
          {/* Display PriceRange component */}
          <PriceRange priceRanges={priceRanges} onPriceRangeClick={onPriceRangeClick} />
          <ChangeCurrency
            onChange={changeCurrency}
          />
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
                setLoading={setLoading}
                setLoadingMessage={setLoadingMessage}
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