
import React, { useState } from 'react';

const PriceRangeComponent = ({ onPriceRangeChange }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    onPriceRangeChange(e.target.value, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    onPriceRangeChange(minPrice, e.target.value);
  };

  return (
    <div className="price-range-component">
      <label>Price Range:</label>
      <div>
        <input 
          type="number" 
          value={minPrice} 
          onChange={handleMinPriceChange} 
          placeholder="Min Price" 
        />
        <input 
          type="number" 
          value={maxPrice} 
          onChange={handleMaxPriceChange} 
          placeholder="Max Price" 
        />
      </div>
      <input 
        type="range" 
        min={0} 
        max={1000} 
        value={minPrice} 
        onChange={handleMinPriceChange} 
      />
      <input 
        type="range" 
        min={0} 
        max={1000} 
        value={maxPrice} 
        onChange={handleMaxPriceChange} 
      />
    </div>
  );
};

export default PriceRangeComponent;
