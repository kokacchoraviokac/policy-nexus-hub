
import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatDate, formatNumber, formatCurrency, formatRelativeTime } from '../utils/formatters';
import { logMissingTranslation, formatMissingTranslation } from '../utils/translationValidator';
import en from '../locales/en/index';
import sr from '../locales/sr/index';
import mk from '../locales/mk/index';
import es from '../locales/es/index';

export type Language = 'en' | 'sr' | 'mk' | 'es';

type TranslationParams = Record<string, any>;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
  formatDate: (date: Date | string | number) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatRelativeTime: (date: Date | string | number) => string;
  getMissingTranslationsCount: () => number;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LANGUAGE_STORAGE_KEY = 'policyhub_language';

type LanguageProviderProps = {
  children: React.ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    
    if (savedLanguage && ['en', 'sr', 'mk', 'es'].includes(savedLanguage)) {
      return savedLanguage as Language;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'sr', 'mk', 'es'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>(en);
  const [isLoading, setIsLoading] = useState(true);
  const [missingTranslationsCount, setMissingTranslationsCount] = useState(0);

  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    setLanguageState(newLanguage);
  };

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        
        let translationData: Record<string, string>;
        
        if (language === 'en') {
          translationData = en;
        } else if (language === 'sr') {
          translationData = sr;
        } else if (language === 'mk') {
          translationData = mk;
        } else if (language === 'es') {
          translationData = es;
        } else {
          translationData = en; // Fallback to English
        }
        
        setTranslations(translationData);
        
        if (language !== 'en') {
          const englishKeys = Object.keys(en);
          const currentKeys = Object.keys(translationData);
          const missingCount = englishKeys.filter(key => !currentKeys.includes(key)).length;
          setMissingTranslationsCount(missingCount);
        } else {
          setMissingTranslationsCount(0);
        }
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        if (language !== 'en') {
          setTranslations(en);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string, params?: TranslationParams): string => {
    if (isLoading) return key;
    
    let translation = translations[key];
    if (!translation) {
      logMissingTranslation(key, language);
      return formatMissingTranslation(key);
    }
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }
    
    return translation;
  };

  const getMissingTranslationsCount = () => {
    return missingTranslationsCount;
  };

  const formatDateWithCurrentLang = (date: Date | string | number) => 
    formatDate(date, language);
    
  const formatNumberWithCurrentLang = (number: number, options?: Intl.NumberFormatOptions) => 
    formatNumber(number, language, options);
    
  const formatCurrencyWithCurrentLang = (amount: number, currencyCode: string = 'EUR') => 
    formatCurrency(amount, language, currencyCode);
    
  const formatRelativeTimeWithCurrentLang = (date: Date | string | number) => 
    formatRelativeTime(date, language);

  const value = {
    language,
    setLanguage,
    t,
    formatDate: formatDateWithCurrentLang,
    formatNumber: formatNumberWithCurrentLang,
    formatCurrency: formatCurrencyWithCurrentLang,
    formatRelativeTime: formatRelativeTimeWithCurrentLang,
    getMissingTranslationsCount
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
