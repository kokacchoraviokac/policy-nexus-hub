
import { Language } from '@/contexts/LanguageContext';
import en from '@/locales/en/index';
import sr from '@/locales/sr/index';
import mk from '@/locales/mk/index';
import es from '@/locales/es/index';

/**
 * Test if all parameters in English translations exist in other languages
 */
export const testTranslationParameters = () => {
  const issues: Record<string, string[]> = {};
  const allKeys = Object.keys(en);
  const languages: Record<Language, any> = { en, sr, mk, es };
  
  // Regex to find all {key} parameters
  const paramRegex = /\{([^}]+)\}/g;
  
  // Skip English as it's the source
  ['sr', 'mk', 'es'].forEach(langCode => {
    const lang = langCode as Language;
    const langData = languages[lang];
    const inconsistent: string[] = [];
    
    allKeys.forEach(key => {
      // Skip if translation doesn't exist
      if (!langData[key]) return;
      
      const enValue = en[key];
      const translatedValue = langData[key];
      
      // Find all params in English
      const enParams = new Set();
      let match;
      while ((match = paramRegex.exec(enValue)) !== null) {
        enParams.add(match[1]);
      }
      
      // Reset regex lastIndex
      paramRegex.lastIndex = 0;
      
      // Find all params in translation
      const translatedParams = new Set();
      while ((match = paramRegex.exec(translatedValue)) !== null) {
        translatedParams.add(match[1]);
      }
      
      // Check if all params in English are in translation
      let missingParams = false;
      enParams.forEach(param => {
        if (!translatedParams.has(param)) {
          missingParams = true;
        }
      });
      
      // Check if translation has extra params
      let extraParams = false;
      translatedParams.forEach(param => {
        if (!enParams.has(param)) {
          extraParams = true;
        }
      });
      
      if (missingParams || extraParams) {
        inconsistent.push(key);
      }
    });
    
    if (inconsistent.length > 0) {
      issues[lang] = inconsistent;
    }
  });
  
  return {
    passed: Object.keys(issues).length === 0,
    issues
  };
};

export default testTranslationParameters;
