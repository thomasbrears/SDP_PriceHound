import React from 'react';

const ProductFeaturedSection = ({ name, tagline }) => {
  return (
    <section className="product-featured">
      <h1>{name}</h1>
      <p className="tagline">{tagline}</p>
    </section>
  );
};

export default ProductFeaturedSection;
