
import React, { createContext, useContext, useState, useEffect } from 'react';

// Supported languages based on the requirements
export type Language = 'en' | 'sr' | 'mk' | 'es';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Local storage key for saving language preference
const LANGUAGE_STORAGE_KEY = 'policyhub_language';

type LanguageProviderProps = {
  children: React.ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from local storage or use browser language or default to English
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    
    if (savedLanguage && ['en', 'sr', 'mk', 'es'].includes(savedLanguage)) {
      return savedLanguage as Language;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'sr', 'mk', 'es'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    return 'en'; // Default to English
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Update the language and save to local storage
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    setLanguageState(newLanguage);
  };

  // Load translations for the current language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        const module = await import(`../locales/${language}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to English if translation file cannot be loaded
        if (language !== 'en') {
          const fallbackModule = await import('../locales/en.json');
          setTranslations(fallbackModule.default);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (isLoading) return key; // Return the key while loading
    
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    return translation;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
