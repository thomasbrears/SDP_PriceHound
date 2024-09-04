
import React, { useState } from 'react';

const SortComponent = ({ onSort }) => {
  const [sortBy, setSortBy] = useState('price');

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    onSort(e.target.value);
  };

  return (
    <div className="sort-component">
      <label>Sort By:</label>
      <select value={sortBy} onChange={handleSortChange}>
        <option value="price">Price</option>
        <option value="category">Category</option>
      </select>
    </div>
  );
};

export default SortComponent;
