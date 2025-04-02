
import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import MainRoutes from './routes/MainRoutes';
import { AuthRoutes } from './routes/AuthRoutes';
import { Toaster as SonnerToaster } from "sonner";
import { NotificationsProvider } from './contexts/NotificationsContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>
          <Router>
            <Routes>
              {AuthRoutes}
              {MainRoutes}
            </Routes>
            <SonnerToaster position="top-right" closeButton={true} />
          </Router>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
