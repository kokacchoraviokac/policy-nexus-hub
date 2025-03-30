
import en from '../../../locales/en/index';
import sr from '../../../locales/sr/index';
import mk from '../../../locales/mk/index';
import es from '../../../locales/es/index';
import { Language } from '@/contexts/LanguageContext';
import { TestResult } from './types';

/**
 * Tests if a translation with HTML tags is consistent across all languages
 */
export const testHtmlTranslations = (key: string): TestResult[] => {
  const results: TestResult[] = [];
  const translations = { en, sr, mk, es };
  const languages = Object.keys(translations) as Language[];
  
  // First check if English has any HTML tags
  const englishText = translations.en[key];
  if (!englishText) {
    return [{ passed: false, message: `Key "${key}" does not exist in English` }];
  }
  
  const htmlTagRegex = /<[^>]+>/g;
  const englishTags = englishText.match(htmlTagRegex) || [];
  
  if (englishTags.length === 0) {
    // No HTML tags to check
    return [{ passed: true, message: `No HTML tags found in "${key}"` }];
  }
  
  // Check if all other languages have the same HTML tags
  languages.forEach(lang => {
    if (lang === 'en') return; // Skip English as it's our reference
    
    const text = translations[lang][key];
    if (!text) {
      results.push({
        passed: false,
        message: `Translation missing for "${key}" in ${lang.toUpperCase()}`
      });
      return;
    }
    
    const langTags = text.match(htmlTagRegex) || [];
    const missingTags = englishTags.filter(tag => !langTags.includes(tag));
    const extraTags = langTags.filter(tag => !englishTags.includes(tag));
    
    if (missingTags.length > 0 || extraTags.length > 0) {
      results.push({
        passed: false,
        message: `HTML tag mismatch in ${lang.toUpperCase()} for "${key}": ` +
          (missingTags.length > 0 ? `Missing: ${missingTags.join(', ')} ` : '') +
          (extraTags.length > 0 ? `Extra: ${extraTags.join(', ')}` : '')
      });
    } else {
      results.push({
        passed: true,
        message: `HTML tags match in ${lang.toUpperCase()} for "${key}"`
      });
    }
  });
  
  return results;
};
