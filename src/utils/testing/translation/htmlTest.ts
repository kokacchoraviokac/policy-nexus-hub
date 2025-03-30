
import { Language } from '@/contexts/LanguageContext';
import en from '@/locales/en/index';
import sr from '@/locales/sr/index';
import mk from '@/locales/mk/index';
import es from '@/locales/es/index';

/**
 * Test if HTML tags in English translations exist in other languages
 */
export const testHtmlTranslations = () => {
  const issues: Record<string, string[]> = {};
  const allKeys = Object.keys(en);
  const languages: Record<Language, any> = { en, sr, mk, es };
  
  // Regex to find all HTML tags
  const tagRegex = /<[^>]+>/g;
  
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
      
      // Find all HTML tags in English
      const enTags = new Set();
      let match;
      let enTagsCount = 0;
      while ((match = tagRegex.exec(enValue)) !== null) {
        enTags.add(match[0]);
        enTagsCount++;
      }
      
      // Reset regex lastIndex
      tagRegex.lastIndex = 0;
      
      // Find all HTML tags in translation
      const translatedTags = new Set();
      let translatedTagsCount = 0;
      while ((match = tagRegex.exec(translatedValue)) !== null) {
        translatedTags.add(match[0]);
        translatedTagsCount++;
      }
      
      // Check if the number of HTML tags differs
      if (enTagsCount !== translatedTagsCount) {
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

export default testHtmlTranslations;
