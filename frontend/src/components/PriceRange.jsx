import React, { useState, useEffect } from 'react';
import '../css/PriceRange.css'; 

function PriceRange({ priceRanges, onPriceRangeClick }) {
  const [selectedRange, setSelectedRange] = useState(null); // New state for selected range
  // State for custom min and max input
  const [customMin, setCustomMin] = useState(''); 
  const [customMax, setCustomMax] = useState(''); 
  //3 price ranges
  const handleRangeClick = (range) => {
    let min = 0;
    let max = Infinity;

    // Extract price ranges using regular expressions
    const rangeParts = range.match(/\d+(?:,\d{3})*/g);

    if (rangeParts) {
        const numbers = rangeParts.map(part => parseInt(part.replace(/,/g, ''), 10));

        if (numbers.length === 2) {
            // range：$min — $max
            min = numbers[0];
            max = numbers[1];
        } else if (numbers.length === 1) {
            // the case of a single price value (e.g., with no upper limit)
            max = numbers[0];
        }
    }

    setSelectedRange(range); // update selected range
    onPriceRangeClick({ min, max }); // call the parent component's callback function
};

useEffect(() => {
  const min = parseInt(customMin, 10);
  const max = parseInt(customMax, 10);

  if (!isNaN(min) && !isNaN(max)) {
    if (max > min) {
      onPriceRangeClick({ min, max }); 
      setSelectedRange(`${min}-${max}`);
    } else {
      console.log("Maximum value must be greater than the minimum value.");
    }
  }
}, [customMin, customMax]);

// min/max price cap
const handleCustomPriceSubmit = () => {
  // Validate custom min and max values
  const min = parseInt(customMin, 10);
  const max = parseInt(customMax, 10);

  if (!isNaN(min) && (!isNaN(max) || customMax === '')) {
    onPriceRangeClick({ min, max: isNaN(max) ? Infinity : max }); // Call callback with custom price range
    setSelectedRange(`${min}-${customMax || '∞'}`); // Update selected range to show custom input
  } else {
    alert("Please enter valid numeric values for the price range.");
  }
};

const handleMinChange = (e) => {
  const value = parseInt(e.target.value, 10);
  setCustomMin(value > 0 ? value : '');  
};

const handleMaxChange = (e) => {
  const value = parseInt(e.target.value, 10);
  setCustomMax(value > 0 ? value : ''); 
};

  return (
  // Display price ranges(3) and custom min-max price component
    <div className="price-range">
       {/* Display 3 price-range component */}
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
      {/* Display custom min-max price component */}
      <div className="custom-price-range">
        <h4><span className="line"></span> Custom Price Range:</h4>
        <div className="custom-inputs">
          <input 
            type="number" 
            value={customMin} 
            onChange={handleMinChange}  
            placeholder="$Min " 
          />
          <span>—</span>  
          <input 
            type="number" 
            value={customMax} 
            onChange={handleMaxChange} 
            placeholder=" $Max" 
          />
        </div>
      </div>
    </div>
  );
}

export default PriceRange;
