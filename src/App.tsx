
import React from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AppRoutes from '@/routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
