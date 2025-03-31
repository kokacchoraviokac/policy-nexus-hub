
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { format } from "date-fns";
import { enUS, es, mk, sr } from "date-fns/locale";
import en from "@/locales/en";
import es_translations from "@/locales/es";
import mk_translations from "@/locales/mk";
import sr_translations from "@/locales/sr";

export type Language = "en" | "es" | "mk" | "sr";

// Base translations structure
interface Translations {
  [key: string]: string | Translations;
}

// Extended translations per language
interface LanguageTranslations {
  en: Translations;
  es: Translations;
  mk: Translations;
  sr: Translations;
}

export interface LanguageContextProps {
  currentLanguage: Language;
  language: Language; // Add alias for backward compatibility
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: string | Date, formatPattern?: string) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatDateTime: (date: string | Date, formatPattern?: string) => string;
  getMissingTranslationsCount?: (lang: Language) => number; // Add this for translation components
}

const defaultLanguageContext: LanguageContextProps = {
  currentLanguage: "en",
  language: "en", // Add alias
  setLanguage: () => {},
  t: () => "",
  formatDate: () => "",
  formatCurrency: () => "",
  formatNumber: () => "",
  formatDateTime: () => "",
};

export const LanguageContext = createContext<LanguageContextProps>(defaultLanguageContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

const translations: LanguageTranslations = {
  en,
  es: es_translations,
  mk: mk_translations,
  sr: sr_translations,
};

const locales = {
  en: enUS,
  es,
  mk,
  sr,
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  initialLanguage = "en" 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "es", "mk", "sr"].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Mock function for translation components - replace with actual implementation if needed
  const getMissingTranslationsCount = (lang: Language) => {
    return 0; // Placeholder implementation
  };

  // Function to get a value from nested translations using a dot notation key
  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      const keys = key.split(".");
      let value: any = translations[currentLanguage];
      
      // Navigate through the nested objects
      for (const k of keys) {
        if (value[k] === undefined) {
          // Fallback to English if key not found in current language
          if (currentLanguage !== "en") {
            let fallbackValue: any = translations["en"];
            for (const fk of keys) {
              if (fallbackValue[fk] === undefined) {
                return key; // Key not found even in the fallback
              }
              fallbackValue = fallbackValue[fk];
            }
            // If found in the fallback
            value = fallbackValue;
            break;
          } else {
            return key; // Key not found in English (the fallback)
          }
        }
        value = value[k];
      }
      
      // If the value is not a string (e.g., it's an object), return the key
      if (typeof value !== "string") {
        return key;
      }
      
      // Replace parameters in the string if provided
      if (params) {
        // Match {{param}} pattern in the string
        const paramPattern = /\{\{([^}]+)\}\}/g;
        return value.replace(paramPattern, (_, paramName) => {
          return params[paramName] !== undefined 
            ? String(params[paramName]) 
            : `{{${paramName}}}`;
        });
      }
      
      return value;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  const formatDate = (date: string | Date, formatPattern: string = "PP"): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, formatPattern, { locale: locales[currentLanguage] });
    } catch (error) {
      console.error("Date formatting error:", error);
      return String(date);
    }
  };

  const formatDateTime = (date: string | Date, formatPattern: string = "PPp"): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, formatPattern, { locale: locales[currentLanguage] });
    } catch (error) {
      console.error("DateTime formatting error:", error);
      return String(date);
    }
  };

  const formatCurrency = (amount: number, currencyCode: string = "RSD"): string => {
    try {
      return new Intl.NumberFormat(currentLanguage, {
        style: "currency",
        currency: currencyCode,
      }).format(amount);
    } catch (error) {
      console.error("Currency formatting error:", error);
      return `${amount} ${currencyCode}`;
    }
  };

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(currentLanguage, options).format(num);
    } catch (error) {
      console.error("Number formatting error:", error);
      return String(num);
    }
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        language: currentLanguage, // Add alias for backward compatibility
        setLanguage, 
        t, 
        formatDate,
        formatCurrency,
        formatNumber,
        formatDateTime,
        getMissingTranslationsCount
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
