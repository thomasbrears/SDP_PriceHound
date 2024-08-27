import React from 'react';

const ProductImages = ({ images, name }) => {
  return (
    <div className="product-images">
      <img src={images[0]} alt={name} className="main-image" />
      <div className="additional-images">
        {images.slice(1).map((img, index) => (
          <img key={index} src={img} alt={`Additional ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
