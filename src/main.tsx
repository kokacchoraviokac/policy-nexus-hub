
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from '@/contexts/ThemeContext'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
