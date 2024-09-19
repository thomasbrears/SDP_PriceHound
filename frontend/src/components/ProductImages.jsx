import React, { useState } from 'react';

const ProductImages = ({ images, name }) => {
  const [mainImage, setMainImage] = useState(images[0]); // Set the initial main image

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  return (
    <div className="product-images">
      <img src={mainImage} alt={name} className="main-image" />
      <div className="additional-images">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${name} ${index + 1}`}
            onClick={() => handleImageClick(image)}
            className={`thumbnail ${image === mainImage ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;