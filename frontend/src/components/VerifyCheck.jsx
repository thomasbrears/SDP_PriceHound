import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const VerifyCheck = () => {
  const token = localStorage.getItem('token');
  return (
    token ? <Outlet /> : <Navigate to="/" />
  );
};

export default VerifyCheck;
