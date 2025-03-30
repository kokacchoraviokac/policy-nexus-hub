
import { Language } from '@/contexts/LanguageContext';
import en from '@/locales/en/index';
import sr from '@/locales/sr/index';
import mk from '@/locales/mk/index';
import es from '@/locales/es/index';

/**
 * Test if all keys in English exist in other languages
 */
export const testTranslationExistence = () => {
  const issues: Record<string, string[]> = {};
  const allKeys = Object.keys(en);
  const languages: Record<Language, any> = { en, sr, mk, es };
  
  // Skip English as it's the source
  ['sr', 'mk', 'es'].forEach(langCode => {
    const lang = langCode as Language;
    const langData = languages[lang];
    const missing: string[] = [];
    
    allKeys.forEach(key => {
      if (!langData[key]) {
        missing.push(key);
      }
    });
    
    if (missing.length > 0) {
      issues[lang] = missing;
    }
  });
  
  return {
    passed: Object.keys(issues).length === 0,
    issues
  };
};

export default testTranslationExistence;
