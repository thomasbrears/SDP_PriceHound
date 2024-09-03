import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/CategoryButton.css'; 
import '../css/HomePage.css'; 

function CategorySearch({ category, setLoading, backgroundImage }) {
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true, `Searching ${category}...`); // Pass the loading message

    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${category}`);
      setLoading(false);
      navigate('/search', { state: { searchResults: response.data, query: category } });
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
