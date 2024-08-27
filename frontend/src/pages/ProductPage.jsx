import React from 'react';
import ProductFeaturedSection from '../components/ProductFeaturedSection';
import Breadcrumb from '../components/Breadcrumb';
import ProductImages from '../components/ProductImages';
import ProductInfo from '../components/ProductInfo';
import PriceComparisonSection from '../components/PriceComparisonSection';
import '../css/ProductPage.css';

const ProductPage = () => {
  // Mock data to use in the component. Replace with real data.
  const product = {
    id: "12345", 
    name: "Apple Macbook Pro 14 inch Laptop with M3 Chip",
    slug: "apple-macbook-pro-14-inch-laptop-with-m3-chip", 
    category: "Laptops",
    subCategory: "Apple MacBook",
    description: "Apple Macbook Pro 14 inch Laptop with M3 Chip Lorem ipsum odor amet, consectetuer adipiscing elit. Aliquet nullam cubilia primis phasellus lectus rhoncus torquent justo.",
    images: [
      "https://www.pbtech.co.nz/imgprod/N/B/NBKAPP143151212__1.jpg?h=3045129675", // Main image
      "https://www.pbtech.co.nz/imgprod/N/B/NBKAPP143151212__2.jpg?h=747220081", // Smaller images below the main image
      "https://www.pbtech.co.nz/imgprod/N/B/NBKAPP143151212__3.jpg?h=1536072935",
      "https://www.pbtech.co.nz/imgprod/N/B/NBKAPP143151212__5.jpg?h=3157701088",
    ],
    retailers: [
      {
        name: "PB Technologies Ltd",
        price: 1997.00,
        logo: "https://www.pbtech.co.nz/imglib/dd/pb-logo-alt.svg",
        shippingInfo: "Free shipping on orders over $100",
        deliveryInfo: "Estimated delivery: 2-5 Working Days",
        location: "New Zealand",
      },
      {
        name: "PB Technologies Ltd TWO",
        price: 2199.99,
        logo: "https://www.pbtech.co.nz/imglib/dd/pb-logo-alt.svg",
        shippingInfo: "Free shipping on orders over $100",
        deliveryInfo: "Estimated delivery: 10-14 Working Days",
        location: "Australia",
      },
      {
        name: "PB Technologies Ltd THREE",
        price: 1829.00,
        logo: "https://www.pbtech.co.nz/imglib/dd/pb-logo-alt.svg",
        shippingInfo: "Free shipping on orders over $800",
        deliveryInfo: "Estimated delivery: 1-4 Working Days",
        location: "New Zealand",
      },
    ],
  };

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
};

export default ProductPage;
