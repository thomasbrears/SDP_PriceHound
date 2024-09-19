// src/pages/ProductNotFound.jsx
import React from 'react';
import MainHeadTitle from '../../components/MainHeadTitle'; 
import PinkButton from '../../components/PinkButton'; 
import '../../css/ErrorPage.css'; 

function ProductNotFoundPage() {
  return (
    <div className="error-page">
      <MainHeadTitle 
        title="Opps! We can't find that product" 
        subtitle="Sorry, we couldn't find the product you're looking for."
      />

      <div className="error-content">
        <p><b>Oops! 🐾</b>
        <br />It seems our hound got a bit lost while sniffing out the best deals for that product.
        <br />You’ve stumbled upon a product that doesn’t exist; It could be out of stock, removed, never existed, or maybe our hound is just too busy chasing bargains.</p>
      </div>

      <div className="error-content">
        <p><b>Here is what you can do:</b></p>
        <a href="/" className="pink-button">Head back to our main page.</a>
        <br />
        <a href="/search" className="pink-button">Try searchimg for the product again.</a>
        <br />
        <a href="/contact-us" className="pink-button">Contact us an let us know if something's off, and we'll get our hound on it!</a>        
      </div>
    </div>
  );
}

export default ProductNotFoundPage;
