
/**
 * Translation Analyzer - Development Tool
 * 
 * This utility is meant to be run in the browser console or as a script
 * to analyze translation files and find issues.
 * 
 * Usage in browser console:
 *   import('/src/utils/devTools/translationAnalyzer.js').then(m => m.analyzeTranslations())
 */

import en from '../../locales/en.json';
import sr from '../../locales/sr/index';
import mk from '../../locales/mk/index';
import es from '../../locales/es/index';
import { generateTranslationReport } from '../translationValidator';

export const analyzeTranslations = () => {
  const report = generateTranslationReport();
  
  console.group('🌐 Translation Analysis Report');
  
  console.log(`📊 Translation Completion:`);
  console.table({
    'Language': ['English', 'Serbian', 'Macedonian', 'Spanish'],
    'Completion': [
      `${report.completionPercentage.en}%`,
      `${report.completionPercentage.sr}%`,
      `${report.completionPercentage.mk}%`,
      `${report.completionPercentage.es}%`
    ],
    'Missing': [
      report.missingCount.en,
      report.missingCount.sr,
      report.missingCount.mk,
      report.missingCount.es
    ],
    'Total Keys': [
      report.totalKeys,
      report.totalKeys,
      report.totalKeys,
      report.totalKeys
    ]
  });
  
  // Show detailed missing keys for each language
  if (report.missingKeys.sr.length > 0) {
    console.group(`🇷🇸 Serbian - Missing ${report.missingKeys.sr.length} translations`);
    console.table(report.missingKeys.sr);
    console.groupEnd();
  }
  
  if (report.missingKeys.mk.length > 0) {
    console.group(`🇲🇰 Macedonian - Missing ${report.missingKeys.mk.length} translations`);
    console.table(report.missingKeys.mk);
    console.groupEnd();
  }
  
  if (report.missingKeys.es.length > 0) {
    console.group(`🇪🇸 Spanish - Missing ${report.missingKeys.es.length} translations`);
    console.table(report.missingKeys.es);
    console.groupEnd();
  }
  
  // Check for inconsistencies between files
  console.group('🔍 Translation Consistency Issues');
  
  // Check for keys only in English but not in other languages
  const onlyInEnglish = Object.keys(en).filter(key => 
    !Object.keys(sr).includes(key) || 
    !Object.keys(mk).includes(key) || 
    !Object.keys(es).includes(key)
  );
  
  if (onlyInEnglish.length > 0) {
    console.log(`⚠️ ${onlyInEnglish.length} keys exist only in English but are missing in some other languages`);
  }
  
  // Check for keys in other languages but not in English
  const notInEnglish = [
    ...Object.keys(sr).filter(key => !Object.keys(en).includes(key)),
    ...Object.keys(mk).filter(key => !Object.keys(en).includes(key)),
    ...Object.keys(es).filter(key => !Object.keys(en).includes(key))
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
  if (notInEnglish.length > 0) {
    console.log(`⚠️ ${notInEnglish.length} keys exist in other languages but not in English`);
    console.table(notInEnglish);
  }
  
  console.groupEnd(); // Consistency Issues
  
  // Suggestions for improvement
  console.group('💡 Suggestions');
  console.log('1. Fix missing translations, especially frequently used ones');
  console.log('2. Standardize translation keys across all files');
  console.log('3. Consider removing unused keys');
  console.log('4. Run this report regularly as part of the development workflow');
  console.groupEnd(); // Suggestions
  
  console.groupEnd(); // Translation Analysis Report
  
  return report;
};

// Expose the function globally in development
if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  window.__analyzeTranslations = analyzeTranslations;
  console.log('Translation analyzer tool available. Run window.__analyzeTranslations() to use it.');
}

export default { analyzeTranslations };
