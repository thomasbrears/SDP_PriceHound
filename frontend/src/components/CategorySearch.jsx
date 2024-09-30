import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/CategoryButton.css'; 
import '../css/HomePage.css'; 

// Dynamically set the search API URL based on environment
const searchApiUrl = process.env.NODE_ENV === 'production'
? 'https://pricehound.tech/api/search'
: 'http://localhost:8000/api/search';

function CategorySearch({ category, setLoading, backgroundImage }) {
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true, `Searching ${category}...`); // Pass the loading message

    try {
      const response = await axios.get(`${searchApiUrl}?query=${category}`);
      setLoading(false);
      const { searchResults, priceRanges } = response.data;

      navigate('/search', { state: { searchResults: searchResults, query: category } });
    } catch (error) {
      console.error('Error fetching category products:', error);
      setLoading(false);
    }
  };

  return (
    <div
      className="category-card"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      onClick={handleSearch}
    >
      <div className="category-card-content">{category}</div>
    </div>
  );
}

export default CategorySearch;
