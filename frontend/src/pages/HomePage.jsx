import React, { useState } from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import SearchBarBig from '../components/SearchBarBig'; 
import ProductCard from '../components/ProductCard'; 
import CategorySearch from '../components/CategorySearch'; 
import PinkButton from '../components/PinkButton'; 
import Loading from '../components/Loading';
import BrandLogo from '../components/BrandLogo'; 
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css'; 

function HomePage() {
  const navigate = useNavigate(); // Initialize navigate
  const [loading, setLoading] = useState(false); // Initialize the loading state

  // Handle search results from SearchBarBig
  const handleSearchResults = (results) => {
    setLoading(false); // Hide loading once results are ready
    navigate('/search', { state: { searchResults: results } });
  };

  return (
    <div className="home-page">
      {loading && <Loading />} {/* Show loading indicator if loading */}

      <MainHeadTitle 
        title="Compare prices from around the world from the comfort of your couch!"
        subtitle="Always double check prices before buying, we collect our prices from a variety of sources and can't guarantee their accuracy. We are not responsible for any issues that may arise from using this site."
      />

      <div className="search-section">
        <h2>Search over 1000 products from 2 countries</h2>
        <SearchBarBig onResults={handleSearchResults} />
        <div className="suggested-searches">
          <span>Suggested Searches:</span>
          <a href="#">Apple Macbook Pro, 2024</a>
          <a href="#">Samsung S23 256gb</a>
          <a href="#">GeForce RTX whatever its called</a>
        </div>
      </div>

      <div className="featured-products">
        <h3>Featured Products</h3>
        <p className="sub-text">Latest deals</p>
        <div className="product-list">
          <ProductCard productName="Product name" price={200.00} link="/product/1" />
          <ProductCard productName="Product name" price={200.00} link="/product/2" />
          <ProductCard productName="Product name" price={200.00} link="/product/3" />
          <ProductCard productName="Product name" price={200.00} link="/product/4" />
        </div>
      </div>

      {/* Category Section */}
      <div className="category-section">
        <h2>Browse our Categories</h2>
        <p className="sub-text">Browse & compare products from your favorite categories</p>
        <div className="category-buttons">
          <CategorySearch category="Computers" setLoading={setLoading} />
          <CategorySearch category="Laptops" setLoading={setLoading} />
          <CategorySearch category="Audio & Visual" setLoading={setLoading} />
          {/* Add more cards as needed */}
        </div>
        <PinkButton text="Browse all Categories" />
      </div>

      {/* Brand Section */}
      <div className="brand-section">
        <h2>Browse our Brands</h2>
        <p className="sub-text">Browse & compare products from your favorite Brand</p>
        <div className="brand-logos">
          <BrandLogo src="images/apple.png" alt="Apple" link="/brands/apple" />
          <BrandLogo src="/images/bbm.png" alt="BlackBerryMobile" />
          <BrandLogo src="images/huawei.png" alt="huawei" />
          <BrandLogo src="images/addidas.png" alt="Addidas" />
          <BrandLogo src="images/hp.png" alt="hp" />
          <BrandLogo src="images/asus.png" alt="asus" />
          <BrandLogo src="images/logitech.png" alt="logitech" />
          <BrandLogo src="images/msi.png" alt="msi" />
          <BrandLogo src="images/canon.png" alt="canon" />
          <BrandLogo src="images/pioneer.png" alt="pioneer" />
        </div>
        <PinkButton text="Browse all Brands" />
      </div>
    </div>
  );
}

export default HomePage;
