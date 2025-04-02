
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import MainRoutes from './routes/MainRoutes';
import AuthRoutes from './routes/AuthRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from "sonner";
import { NotificationsProvider } from './contexts/NotificationsContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
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
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
