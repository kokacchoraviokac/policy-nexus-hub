
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppRoutes as AllRoutes } from './index';

const AppRoutes: React.FC = () => {
  // The routes from index.tsx are a mix of React elements and route objects
  // We need to render them correctly based on their type
  return (
    <Routes>
      {/* Directly render each route, as they are already Route elements */}
      {AllRoutes}
    </Routes>
  );
};

export default AppRoutes;
