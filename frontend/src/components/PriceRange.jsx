import React from 'react';
import '../css/PriceRange.css'; // 确保引入 CSS 文件

function PriceRange({ priceRanges }) {
  return (
    <div className="price-range">
      <h3>Price Ranges</h3>
      <ul className="price-range-list">
        {priceRanges.map((range, index) => (
          <li key={index} className="price-range-item">{range}</li>
        ))}
      </ul>
    </div>
  );
}

export default PriceRange;