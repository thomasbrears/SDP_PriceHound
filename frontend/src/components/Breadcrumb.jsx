import React from 'react';

const Breadcrumb = ({ category, subCategory, name }) => {
  return (
    <div className="breadcrumb">
      <p>
        PriceHound {'>'} {category} {'>'} {subCategory} {'>'} {name}
      </p>
    </div>
  );
};

export default Breadcrumb;
