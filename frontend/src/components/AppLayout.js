import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const location = useLocation();

  // List of routes where the full header should not be shown
  const authRoutes = ['/login', '/signup', '/reset-password', '/verify-email', '/email-signin'];

  // Check if the current route is in the list of auth routes
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Header />} {/* Conditionally render Header */}
      <main>{children}</main> {/* Render child components */}
      <Footer /> {/* Footer will always be rendered */}
    </>
  );
};

export default AppLayout;