
import React, { Suspense } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AppRoutes from '@/routes/AppRoutes';

// Global loading spinner component
const GlobalLoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<GlobalLoadingSpinner />}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster position="top-right" />
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
