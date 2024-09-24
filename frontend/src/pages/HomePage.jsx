import React, { useState, useEffect } from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import SearchBarBig from '../components/SearchBarBig'; 
import ProductCard from '../components/ProductCard'; 
import CategorySearch from '../components/CategorySearch'; 
import PinkButton from '../components/PinkButton'; 
import Loading from '../components/Loading';
import BrandLogo from '../components/BrandLogo'; 
import Message from '../components/Message';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/HomePage.css'; 

function HomePage() {
  const navigate = useNavigate(); // Initialise navigate
  const location = useLocation(); // Get current location
  const [loading, setLoadingState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [messageInfo, setMessageInfo] = useState({ message: '', type: '' }); 

  const setLoading = (state, message = '') => {
    setLoadingState(state);
    setLoadingMessage(message); // Set the loading message
  };

  // Check if the user has logged out based on the query parameter
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('logout') === 'true') {
      setMessageInfo({ message: 'You have successfully logged out.', type: 'success' });
    } else if (query.get('error') === 'true') {
      setMessageInfo({ message: 'An error occurred during logout.', type: 'error' });
    }
  }, [location]);

  // Handle search results from SearchBarBig
  const handleSearchResults = (results) => {
    setLoading(false); // Hide loading once results are ready
    navigate('/search', { state: { searchResults: results } });
  };

  return (
    <div className="home-page">
      {loading && <Loading message={loadingMessage} />}
      {messageInfo.message && ( <Message key={Date.now()} message={messageInfo.message} type={messageInfo.type} />)}                


      <MainHeadTitle 
        title="Compare prices from around the world from the comfort of your couch!"
        subtitle=""
      />

      <div className="search-section">
        <h2>Search over 1000 products from 2 countries</h2>
        <SearchBarBig onResults={handleSearchResults} />
        <div className="suggested-searches">
          <span>Suggested Searches:</span>
          <a href="#">Apple Macbook Pro, 2024</a>
          <a href="#">Samsung S23 256gb</a>
          <a href="#">GeForce RTX</a>
        </div>
      </div>

      <div className="featured-products">
        <h2>Featured Products</h2>
        <p className="sub-text">Latest deals</p>
        <div className="product-list">
          <ProductCard productName="iPhone 15 Pro 128GB" setLoading={setLoading} productImg="./images/products/iphone-15-pro.png"/>
          <ProductCard productName="Samsung Galaxy Z Flip6" setLoading={setLoading} productImg="./images/products/Galaxy-zflip6.png"/>
          <ProductCard productName="Dyson V8" setLoading={setLoading} productImg="./images/products/dysonv8.png"/>
          <ProductCard productName="Canon EOS R5 Mark II" setLoading={setLoading} productImg="./images/products/canon-eos-r5-mark-ii.png"/>
        </div>
      </div>

      {/* Category Section */}
      <div className="category-section">
        <h2>Browse Categories</h2>
        <p className="sub-text">Browse & compare products from your favorite categories</p>
        <div className="category-buttons">
          <CategorySearch category="Phones" setLoading={setLoading} backgroundImage="images/categorys/phones.jpg" />
          <CategorySearch category="Computers" setLoading={setLoading} backgroundImage="images/categorys/laptop.jpg" />
          <CategorySearch category="Cameras" setLoading={setLoading} backgroundImage="images/categorys/cameras.jpg" />
          <CategorySearch category="Appliances" setLoading={setLoading} backgroundImage="images/categorys/appliances.jpg" />
          <CategorySearch category="Sound" setLoading={setLoading} backgroundImage="images/categorys/sound.jpg" />
          <CategorySearch category="Vision" setLoading={setLoading} backgroundImage="images/categorys/vision.jpg" />
          <CategorySearch category="Automotive" setLoading={setLoading} backgroundImage="images/categorys/automotive.jpg" />
          <CategorySearch category="Clothing and Fashion" setLoading={setLoading} backgroundImage="images/categorys/clothingAndFasion.jpg" />
          <CategorySearch category="Games and Consoles" setLoading={setLoading} backgroundImage="images/categorys/gamesAndConsoles.jpg" />
          <CategorySearch category="Gifts and Flowers" setLoading={setLoading} backgroundImage="images/categorys/giftsAndFlowers.jpg" />
          <CategorySearch category="Health and Beauty" setLoading={setLoading} backgroundImage="images/categorys/healthAndBeauty.jpg" />
          <CategorySearch category="Home and Garden" setLoading={setLoading} backgroundImage="images/categorys/HomeAndGarden.jpg" />
          <CategorySearch category="Small Appliances" setLoading={setLoading} backgroundImage="images/categorys/smallAppliances.jpg" />
          <CategorySearch category="Sports and Outdoors" setLoading={setLoading} backgroundImage="images/categorys/sportsAndOutdoors.jpg" />
          <CategorySearch category="Office Products" setLoading={setLoading} backgroundImage="images/categorys/officeProducts.jpg" />
          <CategorySearch category="Smart Home" setLoading={setLoading} backgroundImage="images/categorys/smartHome.jpg" />         
        </div>
        <a href="/categories" className="pink-button">Browse all Categories</a>
      </div>

      {/* Brand Section */}
      <div className="brand-section">
        <h2>Browse Brands</h2>
        <p className="sub-text">Browse & compare products from your favorite Brand</p>
        <div className="brand-logos">
          <BrandLogo src="images/brands/apple.png" setLoading={setLoading} alt="Apple"  />
          <BrandLogo src="images/brands/bbm.png" setLoading={setLoading} alt="BlackBerryMobile" />
          <BrandLogo src="images/brands/huawei.png" setLoading={setLoading} alt="Huawei" />
          <BrandLogo src="images/brands/addidas.png" setLoading={setLoading} alt="Addidas" />
          <BrandLogo src="images/brands/hp.png" setLoading={setLoading} alt="HP" />
          <BrandLogo src="images/brands/asus.png" setLoading={setLoading} alt="Asus" />
          <BrandLogo src="images/brands/logitech.png" setLoading={setLoading} alt="Logitech" />
          <BrandLogo src="images/brands/msi.png" setLoading={setLoading} alt="MSI" />
          <BrandLogo src="images/brands/canon.png" setLoading={setLoading} alt="Canon" />
          <BrandLogo src="images/brands/pioneer.png" setLoading={setLoading} alt="Pioneer" />
        </div>
        <a href="/brands" className="pink-button">Browse all Brands</a>
      </div>
    </div>
  );
}

export default HomePage;