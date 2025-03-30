
import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en/index'; 
import sr from '@/locales/sr/index';
import mk from '@/locales/mk/index';
import es from '@/locales/es/index';
import { format } from 'date-fns';

// Define supported languages
export type Language = 'en' | 'sr' | 'mk' | 'es';

// Define the structure of your translations
interface LanguageContextProps {
  locale: string;
  language: Language;
  t: (key: string, args?: any) => string;
  setLocale: (locale: string) => void;
  setLanguage: (language: Language) => void;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: string | Date) => string;
  getMissingTranslationsCount: () => number;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextProps>({
  locale: 'en',
  language: 'en',
  t: (key: string) => key,
  setLocale: () => {},
  setLanguage: () => {},
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
  formatDate: (date: string | Date) => date.toString(),
  getMissingTranslationsCount: () => 0,
});

// Hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Merge all translations
const translations = {
  en,
  sr,
  mk,
  es,
};

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>('en');
  const [language, setLanguage] = useState<Language>('en');
  const [missingTranslations, setMissingTranslations] = useState<string[]>([]);

  useEffect(() => {
    // Load locale from localStorage
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && translations[storedLocale as keyof typeof translations]) {
      setLocale(storedLocale);
      setLanguage(storedLocale as Language);
    }
  }, []);

  // Function to track missing translations
  const trackMissingTranslation = (key: string) => {
    if (process.env.NODE_ENV !== 'production') {
      setMissingTranslations(prev => {
        if (!prev.includes(key)) {
          return [...prev, key];
        }
        return prev;
      });
    }
  };

  // Function to get missing translations count
  const getMissingTranslationsCount = (): number => {
    return missingTranslations.length;
  };

  // Function to translate a key
  const t = (key: string, args?: any): string => {
    let translation = translations[locale as keyof typeof translations]?.[key];
    
    if (!translation) {
      // Track missing translation
      trackMissingTranslation(key);
      return key; // Return the key itself as fallback
    }

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
      setLanguage(newLocale as Language);
      localStorage.setItem('locale', newLocale);
    } else {
      console.error(`Locale ${newLocale} not supported`);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      locale, 
      language,
      t, 
      setLocale: updateLocale, 
      setLanguage: updateLocale,
      formatCurrency, 
      formatDate,
      getMissingTranslationsCount
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
