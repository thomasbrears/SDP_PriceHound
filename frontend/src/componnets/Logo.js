import React from 'react';
import logo from '../assets/logo.png'; 

const Logo = () => {
  return (
    <div className="logo">
      <img src={logo} alt="Company Logo" className="logo-img" />
    </div>
  );
};

export default Logo;
