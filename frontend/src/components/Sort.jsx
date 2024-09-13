import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../css/Sort.css';

const Sort = ({ onSort }) => {
  // State to manage the current sort criteria
  const [sortBy, setSortBy] = useState('price');
// Handler for changes in the sort dropdown
  const handleSortChange = (e) => {
    const sortValue = e.target.value; // Get the selected sort value
    console.log(`Sort Value: ${sortValue}`);// Log the selected sort value
    setSortBy(sortValue);// Update the state with the new sort value
    // Call the onSort callback if it is a function
    if (typeof onSort === 'function') {
      onSort(sortValue);
    } else {
      // Log an error if onSort is not a function
      console.error('onSort is not a function');
    }
  };

  return (
    <div className="sort-component">
      <h4 htmlFor="sort"><span className="line"></span>  Sort By:</h4>
      <select id="sort" value={sortBy} onChange={handleSortChange}>
         <option value="">Popularity</option> 
        <option value="bestprice">Price (Lowest to Highest)</option>
        <option value="bestprice-rev">Price (Highest to Lowest)</option>
      </select>
    </div>
  );
};
// PropTypes validation for the onSort prop
Sort.propTypes = {
  onSort: PropTypes.func.isRequired,
};

export default Sort;