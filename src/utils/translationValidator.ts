
import { Language } from '@/contexts/LanguageContext';
import en from '@/locales/en/index';
import sr from '@/locales/sr/index';
import mk from '@/locales/mk/index';
import es from '@/locales/es/index';

interface TranslationReport {
  totalKeys: number;
  missingKeys: Record<Language, string[]>;
  missingCount: Record<Language, number>;
  completionPercentage: Record<Language, number>;
}

/**
 * Generate a comprehensive report about the translation status
 */
export const generateTranslationReport = (): TranslationReport => {
  const allKeys = Object.keys(en);
  const languages: Record<Language, any> = { en, sr, mk, es };
  
  const missingKeys: Record<Language, string[]> = {
    en: [],
    sr: [],
    mk: [],
    es: []
  };
  
  // Find missing keys for each language
  Object.keys(languages).forEach(langCode => {
    const lang = langCode as Language;
    if (lang === 'en') return; // Skip English as it's the source
    
    const langData = languages[lang];
    allKeys.forEach(key => {
      if (!langData[key]) {
        missingKeys[lang].push(key);
      }
    });
  });
  
  // Calculate stats
  const missingCount: Record<Language, number> = {
    en: 0,
    sr: missingKeys.sr.length,
    mk: missingKeys.mk.length,
    es: missingKeys.es.length
  };
  
  const completionPercentage: Record<Language, number> = {
    en: 100,
    sr: Math.round(((allKeys.length - missingCount.sr) / allKeys.length) * 100),
    mk: Math.round(((allKeys.length - missingCount.mk) / allKeys.length) * 100),
    es: Math.round(((allKeys.length - missingCount.es) / allKeys.length) * 100)
  };
  
  return {
    totalKeys: allKeys.length,
    missingKeys,
    missingCount,
    completionPercentage
  };
};

export default generateTranslationReport;
