
import { Language } from '@/contexts/LanguageContext';
import en from '@/locales/en/index';
import sr from '@/locales/sr/index';
import mk from '@/locales/mk/index';
import es from '@/locales/es/index';

export interface TranslationReport {
  totalKeys: number;
  missingKeys: Record<Language, string[]>;
  missingCount: Record<Language, number>;
  completionPercentage: Record<Language, number>;
}

/**
 * Format a missing translation key
 */
export const formatMissingTranslation = (key: string): string => {
  return `[MISSING: ${key}]`;
};

/**
 * Generate a report on translation status
 */
export const generateTranslationReport = (): TranslationReport => {
  const totalKeys = Object.keys(en).length;
  const missingKeys: Record<Language, string[]> = {
    en: [],
    sr: [],
    mk: [],
    es: []
  };
  
  // English is the source, so nothing is missing
  
  // Check Serbian translations
  Object.keys(en).forEach(key => {
    if (!sr[key]) {
      missingKeys.sr.push(key);
    }
  });
  
  // Check Macedonian translations
  Object.keys(en).forEach(key => {
    if (!mk[key]) {
      missingKeys.mk.push(key);
    }
  });
  
  // Check Spanish translations
  Object.keys(en).forEach(key => {
    if (!es[key]) {
      missingKeys.es.push(key);
    }
  });
  
  // Calculate missing counts
  const missingCount = {
    en: missingKeys.en.length,
    sr: missingKeys.sr.length,
    mk: missingKeys.mk.length,
    es: missingKeys.es.length
  };
  
  // Calculate completion percentages
  const completionPercentage = {
    en: 100,
    sr: Math.round(((totalKeys - missingCount.sr) / totalKeys) * 100),
    mk: Math.round(((totalKeys - missingCount.mk) / totalKeys) * 100),
    es: Math.round(((totalKeys - missingCount.es) / totalKeys) * 100)
  };
  
  return {
    totalKeys,
    missingKeys,
    missingCount,
    completionPercentage
  };
};

export default generateTranslationReport;
