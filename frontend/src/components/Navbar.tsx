import { AppBar } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  return location.pathname != '/' ? <AppBar></AppBar> : null;
};
