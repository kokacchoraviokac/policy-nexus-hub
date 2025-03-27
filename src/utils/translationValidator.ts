import en from '../locales/en.json';
import sr from '../locales/sr/index';
import mk from '../locales/mk/index';
import es from '../locales/es.json';
import { Language } from '@/contexts/LanguageContext';

type TranslationReport = {
  missingKeys: Record<string, string[]>;
  totalKeys: number;
  missingCount: Record<string, number>;
  completionPercentage: Record<string, number>;
};

/**
 * Checks if a key exists in the given translations object
 */
export const hasTranslation = (
  key: string,
  translations: Record<string, string>
): boolean => {
  return Object.prototype.hasOwnProperty.call(translations, key);
};

/**
 * Finds keys that exist in the source language but are missing in the target language
 */
export const findMissingTranslations = (
  source: Record<string, string>,
  target: Record<string, string>
): string[] => {
  return Object.keys(source).filter(key => !hasTranslation(key, target));
};

/**
 * Generates a comprehensive report of missing translations across all languages
 */
export const generateTranslationReport = (): TranslationReport => {
  const translations = {
    en,
    sr,
    mk,
    es
  };
  
  // English is considered the source language
  const sourceKeys = Object.keys(translations.en);
  const totalKeys = sourceKeys.length;
  
  const missingKeys: Record<string, string[]> = {
    sr: findMissingTranslations(translations.en, translations.sr),
    mk: findMissingTranslations(translations.en, translations.mk),
    es: findMissingTranslations(translations.en, translations.es),
    // Also check for keys that exist in other languages but not in English
    en: [
      ...findMissingTranslations(translations.sr, translations.en),
      ...findMissingTranslations(translations.mk, translations.en),
      ...findMissingTranslations(translations.es, translations.en)
    ].filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
  };
  
  const missingCount: Record<string, number> = {
    en: missingKeys.en.length,
    sr: missingKeys.sr.length,
    mk: missingKeys.mk.length,
    es: missingKeys.es.length
  };
  
  const completionPercentage: Record<string, number> = {
    en: 100, // English is the reference
    sr: Math.round(((totalKeys - missingKeys.sr.length) / totalKeys) * 100),
    mk: Math.round(((totalKeys - missingKeys.mk.length) / totalKeys) * 100),
    es: Math.round(((totalKeys - missingKeys.es.length) / totalKeys) * 100)
  };
  
  return {
    missingKeys,
    totalKeys,
    missingCount,
    completionPercentage
  };
};

/**
 * For development use - logs a warning when a translation is missing
 */
export const logMissingTranslation = (key: string, language: Language): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Missing translation for key "${key}" in language "${language}"`);
  }
};

/**
 * Development helper to visually highlight missing translations in the UI
 */
export const formatMissingTranslation = (key: string): string => {
  if (process.env.NODE_ENV === 'production') {
    return key;
  }
  
  return `[MISSING: ${key}]`;
};
