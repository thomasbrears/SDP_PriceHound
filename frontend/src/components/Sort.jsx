import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../css/Sort.css';

const Sort = ({ onSort }) => {
  const [sortBy, setSortBy] = useState('price');

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    console.log(`Sort Value: ${sortValue}`);
    setSortBy(sortValue);
    if (typeof onSort === 'function') {
      onSort(sortValue);
    } else {
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

Sort.propTypes = {
  onSort: PropTypes.func.isRequired,
};

export default Sort;