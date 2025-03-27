import sr from '../../../locales/sr/index';
import mk from '../../../locales/mk/index';
import es from '../../../locales/es.json';
import { Language } from '@/contexts/LanguageContext';
import { TestResult } from './types';

/**
 * Tests if a translation exists for all languages
 */
export const testTranslationExists = (key: string): TestResult[] => {
  const results: TestResult[] = [];
  const translations = { sr, mk, es };
  const languages = Object.keys(translations) as Language[];
  
  languages.forEach(lang => {
    const exists = Object.prototype.hasOwnProperty.call(translations[lang], key);
    results.push({
      passed: exists,
      message: exists 
        ? `Translation exists for "${key}" in ${lang.toUpperCase()}` 
        : `Missing translation for "${key}" in ${lang.toUpperCase()}`
    });
  });
  
  return results;
};
