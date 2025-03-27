
import { Language } from "@/contexts/LanguageContext";

/**
 * Format a date based on the current locale
 */
export const formatDate = (date: Date | string | number, language: Language): string => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    sr: 'sr-RS',
    mk: 'mk-MK',
    es: 'es-ES'
  };
  
  return new Intl.DateTimeFormat(localeMap[language], options).format(dateObj);
};

/**
 * Format a number based on the current locale
 */
export const formatNumber = (
  number: number, 
  language: Language, 
  options?: Intl.NumberFormatOptions
): string => {
  if (number === undefined || number === null) return '';
  
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    sr: 'sr-RS',
    mk: 'mk-MK',
    es: 'es-ES'
  };
  
  return new Intl.NumberFormat(localeMap[language], options).format(number);
};

/**
 * Format currency based on the current locale and currency code
 */
export const formatCurrency = (
  amount: number, 
  language: Language, 
  currencyCode: string = 'EUR'
): string => {
  if (amount === undefined || amount === null) return '';
  
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    sr: 'sr-RS',
    mk: 'mk-MK',
    es: 'es-ES'
  };
  
  return new Intl.NumberFormat(localeMap[language], {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Returns relative time (e.g., "2 days ago") based on current locale
 */
export const formatRelativeTime = (
  date: Date | string | number,
  language: Language
): string => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    sr: 'sr-RS',
    mk: 'mk-MK',
    es: 'es-ES'
  };
  
  const rtf = new Intl.RelativeTimeFormat(localeMap[language], { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};
