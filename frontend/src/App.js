import './css/Global.css';
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import HomePage from './pages/HomePage';
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
import VerifyCheck from './components/VerifyCheck';
import VerifyEmailPage from './pages/VerifyEmailPage';
import CompleteSignInPage from './pages/CompleteSignInPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import AdblockDetect from './components/AdblockDetect';
import { ToastContainer, toast } from 'react-toastify'; // Toastify message container
import 'react-toastify/dist/ReactToastify.css'; // Toastify message css
import { ThemeContext } from './ThemeContext';
import AppLayout from './components/AppLayout';
import AdvertisementsPage from './pages/AdvertisementsPage';
import GoogleAnalytics from './components/GoogleAnalytics';

import NotFoundPage from './pages/error/NotFoundPage';
import ProductNotFoundPage from './pages/error/ProductNotFoundPage';
import InternalServerErrorPage from './pages/error/InternalServerErrorPage';
import UnauthorisedPage from './pages/error/UnauthorisedPage';
import ForbiddenPage from './pages/error/ForbiddenPage';

function App() {
  const { theme } = useContext(ThemeContext);
  return (
    
    <BrowserRouter>
      <div className="App">
      <GoogleAnalytics/>{/*to allow cookies for google analytics*/}
      <AdblockDetect /> {/* Adblock detection */}
      {/* Toastify message container with defult location and theme*/}
      <ToastContainer
        theme={theme} // Dynamically set theme (light/dark)
        position="top-center" // Set default position
        draggable={true} // Allow toasts to be draggable
        closeOnClick={true} // Close toast on click
        autoClose={5000} // Auto close after 5 seconds
        hideProgressBar={false} // Show progress bar
        pauseOnHover={true} // Pause on hover
        pauseOnFocusLoss={false} // Keep toast running even when focus is lost
      />
      <AppLayout> {/* App layout */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/brands" element={<BrandPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/admin/add-product-or-retailer" element={<AddProductRetailerPage />} />
          <Route path="/ads" element={<AdvertisementsPage />} />

          {/* Error pages */}
          <Route path="*" element={<NotFoundPage />} />  {/* 404 Error */}
          <Route path="/404" element={<NotFoundPage />} />  {/* 404 Error */}
          <Route path="/500" element={<InternalServerErrorPage />} /> {/* 500 Error */}
          <Route path="/403" element={<ForbiddenPage />} /> {/* 403 Error */}
          <Route path="/401" element={<UnauthorisedPage />} /> {/* 401 Error */}
          <Route path="/product-not-found" element={<ProductNotFoundPage />} />
          

          <Route path="/wishlist" element={<VerifyCheck />}>
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>
          <Route path="/manage-account" element={<VerifyCheck />}>
            <Route path="/manage-account" element={<ManageAccountPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/email-signin" element={<CompleteSignInPage />} />
        </Routes>
        <ScrollToTopButton />
        </AppLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;
