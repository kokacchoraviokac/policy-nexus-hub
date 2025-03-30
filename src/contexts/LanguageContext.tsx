import React, { createContext, useContext, useState, useEffect } from 'react';
import enCommon from '@/locales/en/common.json';
import enLayout from '@/locales/en/layout.json';
import enAuth from '@/locales/en/auth.json';
import enErrors from '@/locales/en/errors.json';
import enDashboard from '@/locales/en/dashboard.json';
import enModules from '@/locales/en/modules.json';
import enPolicies from '@/locales/en/policies/index';
import enCodebook from '@/locales/en/codebook.json';
import enSettings from '@/locales/en/settings.json';
import enFinances from '@/locales/en/finances.json';
import enClaims from '@/locales/en/claims.json';
import { format } from 'date-fns';

// Define the structure of your translations
interface LanguageContextProps {
  locale: string;
  t: (key: string, args?: any) => string;
  setLocale: (locale: string) => void;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: string | Date) => string;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextProps>({
  locale: 'en',
  t: (key: string) => key,
  setLocale: () => {},
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
  formatDate: (date: string | Date) => date.toString(),
});

// Hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Define the translations for each language
const en = {
  ...enCommon,
  ...enLayout,
  ...enAuth,
  ...enErrors,
  ...enDashboard,
  ...enModules,
  ...enPolicies,
  ...enCodebook,
  ...enSettings,
  ...enFinances,
  ...enClaims
};
// Add other language imports and translation objects here, e.g.,
// import frCommon from '@/locales/fr/common.json';
// const fr = { ...frCommon, ... };

// Merge all translations
const translations = {
  en: {
    ...enCommon,
    ...enLayout,
    ...enAuth,
    ...enErrors,
    ...enDashboard,
    ...enModules,
    ...enPolicies,
    ...enCodebook,
    ...enSettings,
    ...enFinances,
    ...enClaims
  },
  // fr, // Add other languages here
};

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    // Load locale from localStorage
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && translations[storedLocale as keyof typeof translations]) {
      setLocale(storedLocale);
    }
  }, []);

  // Function to translate a key
  const t = (key: string, args?: any): string => {
    let translation = translations[locale as keyof typeof translations]?.[key] || key;

    if (args) {
      Object.keys(args).forEach(argKey => {
        const regex = new RegExp(`\\{${argKey}\\}`, 'g');
        translation = translation.replace(regex, args[argKey]);
      });
    }

    return translation;
  };

  // Function to format currency
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Function to format date
  const formatDate = (date: string | Date): string => {
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      return format(parsedDate, 'PPP'); // Customize the format as needed
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  // Update locale and store it in localStorage
  const updateLocale = (newLocale: string) => {
    if (translations[newLocale as keyof typeof translations]) {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
    } else {
      console.error(`Locale ${newLocale} not supported`);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale: updateLocale, formatCurrency, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
};
