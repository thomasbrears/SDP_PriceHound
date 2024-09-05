
import React, { useState , useEffect } from 'react';
const PriceRange = ({ onPriceRangeChange, minPrice, maxPrice }) => {
  const [sliderValue, setSliderValue] = useState([minPrice, maxPrice]);

  // Update slider values when minPrice or maxPrice changes
  useEffect(() => {
    setSliderValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleSliderChange = (event) => {
    const [newMin, newMax] = event.target.value.split(',').map(Number);
    setSliderValue([newMin, newMax]);
    onPriceRangeChange(newMin, newMax);
  };


  return (
    <div className="price-range">
      <div className="price-range-predefined">
      </div>
      <div className="price-range-slider">
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={sliderValue.join(',')}
          onChange={handleSliderChange}
          step="1"
          multiple
        />
        <div className="price-range-values">
          <span>${sliderValue[0]}</span> - <span>${sliderValue[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;