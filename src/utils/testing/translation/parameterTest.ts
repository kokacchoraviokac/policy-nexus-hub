
import en from '../../../locales/en.json';
import sr from '../../../locales/sr/index';
import mk from '../../../locales/mk/index';
import es from '../../../locales/es/index';
import { Language } from '@/contexts/LanguageContext';
import { TestResult } from './types';

/**
 * Tests if a translation has format parameters (like {0}) in all languages
 */
export const testTranslationParameters = (key: string): TestResult[] => {
  const results: TestResult[] = [];
  const translations = { en, sr, mk, es };
  const languages = Object.keys(translations) as Language[];
  
  // First check if English has any parameters
  const englishText = translations.en[key];
  if (!englishText) {
    return [{ passed: false, message: `Key "${key}" does not exist in English` }];
  }
  
  const paramRegex = /\{(\d+)\}/g;
  const englishParams = [...englishText.matchAll(paramRegex)].map(match => match[1]);
  
  if (englishParams.length === 0) {
    // No parameters to check
    return [{ passed: true, message: `No parameters found in "${key}"` }];
  }
  
  // Check if all other languages have the same parameters
  languages.forEach(lang => {
    const text = translations[lang][key];
    if (!text) {
      results.push({
        passed: false,
        message: `Translation missing for "${key}" in ${lang.toUpperCase()}`
      });
      return;
    }
    
    const langParams = [...text.matchAll(paramRegex)].map(match => match[1]);
    const missingParams = englishParams.filter(p => !langParams.includes(p));
    const extraParams = langParams.filter(p => !englishParams.includes(p));
    
    if (missingParams.length > 0 || extraParams.length > 0) {
      const missingParamsText = missingParams.length > 0 ? `Missing: {${missingParams.join('}, {')}} ` : '';
      const extraParamsText = extraParams.length > 0 ? `Extra: {${extraParams.join('}, {')}}` : '';
      
      results.push({
        passed: false,
        message: `Parameter mismatch in ${lang.toUpperCase()} for "${key}": ${missingParamsText}${extraParamsText}`.trim()
      });
    } else {
      results.push({
        passed: true,
        message: `Parameters match in ${lang.toUpperCase()} for "${key}"`
      });
    }
  });
  
  return results;
};
