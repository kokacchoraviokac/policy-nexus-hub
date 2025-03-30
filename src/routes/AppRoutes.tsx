
import React from 'react';
import { Routes } from 'react-router-dom';
import { AppRoutes as AllRoutes } from './index';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {AllRoutes}
    </Routes>
  );
};

export default AppRoutes;
