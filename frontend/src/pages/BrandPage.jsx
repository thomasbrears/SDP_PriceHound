import React, { useState, useEffect }  from 'react';
import MainHeadTitle from '../components/MainHeadTitle';
import PinkButton from '../components/PinkButton'; 
import { useNavigate } from 'react-router-dom';
import '../css/BrandPage.css';
import LZString from 'lz-string';
import axios from 'axios'; 
import Loading from '../components/Loading';
import brandData from '../data/brandData.json';

const BrandPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMessage, setLoadingMessage] = useState(''); // Define loading message state
  const [loading, setLoading] = useState(false); // Track loading state
 
  const itemsPerPage = 100; // Number of items to show per page

  // Compress the brandData and store it in localStorage on the first render
  useEffect(() => {
    const compressedData = LZString.compressToUTF16(JSON.stringify(brandData));
    localStorage.setItem('compressedBrandData', compressedData);
  }, []);

  // Function to handle category button clicks
  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setCurrentPage(1); // Reset to the first page when a new category is selectedgit 
    
  };
  
 // Function to handle brand button clicks and search
 const handleBrandClick = (brand) => {
  // Call handleSearch with the brand text
  handleSearch(brand.text, 'brand'); // Pass 'brand' as type for loading message
};
  // Dynamically set the search API URL based on environment
  const searchApiUrl = process.env.NODE_ENV === 'production'
  ? 'https://pricehound.tech/api/search'
  : 'http://localhost:8000/api/search';


// Function to handle a search for the selected brand
const handleSearch = async (query, type) => {
  setLoadingMessage(`Searching ${type === 'brand' ? query : selectedCategory}...`); // Set the loading message
  setLoading(true); // Show the loading animation
  
  try {
    const country = localStorage.getItem('selectedCountry');
    const response = await axios.get(`${searchApiUrl}?query=${encodeURIComponent(query)}&country=${encodeURIComponent(country)}`); 
    // Make an API request to search for the brand to search for the brand
    setLoading(false); 
    
    const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

    navigate('/search', { state: { searchResults, query, priceRanges: fetchedPriceRanges } }); // Navigate to the search page with the search results
  } catch (error) {
    console.error('Error fetching brand products:', error); // Log any errors
    setLoading(false); // Stop the loading animation
  }
};
  // Retrieve and decompress data from localStorage
  const getBrandDataFromLocalStorage = () => {
    const compressedData = localStorage.getItem('compressedBrandData');
    if (compressedData) {
      return JSON.parse(LZString.decompressFromUTF16(compressedData));
    }
    return {};
  };

  const storedBrandData = getBrandDataFromLocalStorage();
  const currentBrands = selectedCategory ? storedBrandData[selectedCategory] : [];
  const totalPages = Math.ceil(currentBrands.length / itemsPerPage);

  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentBrands.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="brand-page">
      <MainHeadTitle title="Find your favourite brands" subtitle="We're comparing over 1000 products globally to get the best deals." />

      <div className="brand-category-buttons">
      {loading && <Loading message={loadingMessage} />} {/* Show loading spinner and message if loading */}
      
        {/* Create buttons for each letter in the brand data */}
        {Object.keys(brandData).map((key) => (
          <PinkButton
            key={key}
            text={key}
            onClick={() => handleCategoryClick(key)}
            className="pink-button" 
          />
        ))}
      </div>

      {selectedCategory && (
        <div>
          <ul className="brand-list">
            {currentItems.map((brand, index) => (
              <li key={index}>
               {/* Replace <a> with <button> */}
              <button
                className="brand-button"
                onClick={() => handleBrandClick(brand)}  // Call handleBrandClick on button click
                >
                {brand.text}
              </button>
            </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
          
        </div>
      )}

    </div>
  );
};

export default BrandPage;