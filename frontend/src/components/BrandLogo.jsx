import React from 'react';
import '../css/BrandLogo.css';

function BrandLogo({ src, alt, link }) {
  return (
    <a href={link} className="brand-logo">
      <img src={src} alt={alt} />
    </a>
  );
}

export default BrandLogo;
