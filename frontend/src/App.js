// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import AboutPage from './pages/AboutPage';
import WishList from './pages/WishList';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/wishlist" element={<WishList/>} />
      </Routes>
    </Router>
  );
}

export default App;
