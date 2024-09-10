import React, { useState } from 'react';
import '../css/PriceRange.css'; 

function PriceRange({ priceRanges, onPriceRangeClick }) {
  const [selectedRange, setSelectedRange] = useState(null); // New state for selected range

  const handleRangeClick = (range) => {
    let min = 0;
    let max = Infinity;

    const rangeParts = range.match(/(\d{1,3}(,\d{3})*)/g);

    if (rangeParts) {
      const numbers = rangeParts.map(part => parseInt(part.replace(/,/g, ''), 10));

      if (range.includes("Over")) {
        min = numbers[0];
        max = Infinity;
      } else if (range.includes("—")) {
        min = numbers[0];
        max = numbers[1];
      } else if (range.includes("Up to")) {
        max = numbers[0];
      }
    }

    setSelectedRange(range); // Update selected range state
    onPriceRangeClick({ min, max });
  };

  return (
    <div className="price-range">
      <h4><span className="line"></span> Price Ranges:</h4>
      <ul className="price-range-list">
        {priceRanges.map((range, index) => (
          <li 
            key={index} 
            className={`price-range-item ${selectedRange === range ? 'selected' : ''}`}
            onClick={() => handleRangeClick(range)}
          >
            <span className="indicator"></span>
            {range}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PriceRange;
