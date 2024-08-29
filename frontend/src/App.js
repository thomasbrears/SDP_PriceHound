// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import AboutPage from './pages/AboutPage';
import SignUpPage from './pages/SignUpPage';
import ContactPage from './pages/ContactPage';
import WishlistPage from './pages/WishlistPage';
import ManageAccountPage from './pages/ManageAccountPage';
import BrandPage from './pages/BrandPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import AddProductRetailerPage from './pages/AddProductRetailerPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {  
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/brands" element={<BrandPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/test" element={<TestPage />} />
          {/* Dynamic route for specific product */}
          <Route path="/product" element={<ProductPage />} />
          <Route path="/admin/add-product-or-retailer" element={<AddProductRetailerPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/manage-account" element={<ManageAccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
        <Footer />
      </div> 
    </BrowserRouter>
  );
}

export default App;
