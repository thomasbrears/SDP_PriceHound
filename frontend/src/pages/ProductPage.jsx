import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle';
import ComparisonCard from '../components/ComparisonCard';
import '../css/ProductPage.css'; 

function ProductPage() {
  return (
    <div className="product-page">
      {/* Main Product Title */}
      <MainHeadTitle 
        title="Apple MacBook Air (2023) - M2"
        subtitle="Found at 3 retailers from 1 country for as low as $1997.00"
      />

      {/* Product Details Section */}
      <div className="product-page-details">
        <div className="product-page-main-image">
          {/* Placeholder for main product image */}
          <div className="product-page-image-placeholder"></div>
        </div>

        <div className="product-page-info">
          <h3>Apple MacBook Air (2023) - M2</h3>
          <p className="product-page-price">$1997.00 - $2099.00 <span className="product-page-rating">★★★★☆ (2 reviews)</span></p>
          <p className="product-page-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at lorem consequat mi tristique hendrerit aliquet. Sed aliquam posuere quam ac dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at lorem consequat mi tristique hendrerit aliquet.
          </p>
          {/* Additional Product Info */}
          <ul className="product-page-additional-info">
            <li>Lorem ipsum dolor sit amet, adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
          </ul>
        </div>
      </div>

      {/* Image Thumbnails Section */}
      <div className="product-page-thumbnails">
        <div className="product-page-thumbnail"></div>
        <div className="product-page-thumbnail"></div>
        <div className="product-page-thumbnail"></div>
      </div>

      {/* Comparison Section */}
      <div className="product-page-comparison-section">
        <h2>Let's Compare Prices</h2>
        <p>We have found this product on 4 retailers in 2 countries</p>

        {/* Example ComparisonCards */}
        <ComparisonCard
          logo="/images/pbtech.png"
          title="products name from retailer"
          price="$1997.00"
          link="#"
          shippingInfo="This retailer typically offers Free worldwide shipping on orders over $100"
          deliveryTime="Estimated delivery is 2-5 Working Days"
          location="This seller is based in and ships from New Zealand"
        />

        {/* Additional ComparisonCards as needed */}
        <ComparisonCard
          logo="/images/pbtech.png"
          title="PB Technologies Ltd"
          price="$1098.99"
          link="#"
          shippingInfo="This retailer typically offers Free worldwide shipping on orders over $100"
          deliveryTime="Estimated delivery is 2-5 Working Days"
          location="This seller is based in and ships from New Zealand"
        />
      </div>

      {/* Product Rating Section */}
      <div className="product-page-rating-section">
        <h3>Product Rating</h3>
        <p>This product has been rated 4 out of 5 stars by two of our users.</p>
        {/* Stars Representation and Rating Inputs */}
        <div className="product-page-stars">
          ★★★★☆ (4 stars)
        </div>
        {/* CTA for product rating and feedback */}
        <div className="product-page-cta-feedback">
          <p>Do you have this product? How would you rate it?</p>
          <input type="range" min="1" max="5" step="1" />
          <button className="product-page-submit-rating">Submit Rating</button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

  /*
  // Calculate the price range and tagline dynamically
  const prices = product.retailers.map(retailer => retailer.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

  const countries = [...new Set(product.retailers.map(retailer => retailer.location))];
  const tagline = `Found at ${product.retailers.length} retailers from ${countries.length} ${countries.length > 1 ? 'countries' : 'country'} for as low as $${minPrice.toFixed(2)}`;

  return (
    <div className="product-page">
      <ProductFeaturedSection name={product.name} tagline={tagline} />
      <Breadcrumb category={product.category} subCategory={product.subCategory} name={product.name} />
      <div className="product-details">
        <ProductImages images={product.images} name={product.name} />
        <ProductInfo 
          name={product.name} 
          priceRange={priceRange} 
          rating={4} 
          ratingCount={5} 
          description={product.description} 
        />
      </div>
      <PriceComparisonSection retailers={product.retailers} />
    </div>
  );
}; */
