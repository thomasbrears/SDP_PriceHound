import React from 'react';
import '../css/PriceRange.css'; // 确保引入 CSS 文件

function PriceRange({ priceRanges }) {
  return (
    <div className="price-range">
      <h4 ><span className="line"></span>   Price Ranges:</h4>
      <ul className="price-range-list">
        {priceRanges.map((range, index) => (
          <li key={index} className="price-range-item">{range}</li>
        ))}
      </ul>
    </div>
  );
}

export default PriceRange;