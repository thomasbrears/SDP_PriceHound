import React from 'react';
import '../css/CategoryButton.css'; 

function CategoryButton({ categoryName }) {
  return (
    <button className="category-button">
      {categoryName}
    </button>
  );
}

export default CategoryButton;
