import React, { useState } from 'react';
import '../css/PriceRange.css'; 

function PriceRange({ priceRanges, onPriceRangeClick }) {
  const [selectedRange, setSelectedRange] = useState(null); // New state for selected range

  const handleRangeClick = (range) => {
    let min = 0;
    let max = Infinity;

    // 使用正则表达式提取价格范围
    const rangeParts = range.match(/\d+(?:,\d{3})*/g);

    if (rangeParts) {
        const numbers = rangeParts.map(part => parseInt(part.replace(/,/g, ''), 10));

        if (numbers.length === 2) {
            // 范围格式：$min — $max
            min = numbers[0];
            max = numbers[1];
        } else if (numbers.length === 1) {
            // 单一价格值的情况（例如没有上限的情况）
            max = numbers[0];
        }
    }

    setSelectedRange(range); // 更新选中的范围状态
    onPriceRangeClick({ min, max }); // 调用回调函数
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
