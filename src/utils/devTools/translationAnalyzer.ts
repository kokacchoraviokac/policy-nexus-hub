
/**
 * Translation Analyzer - Development Tool
 * 
 * This utility is meant to be run in the browser console or as a script
 * to analyze translation files and find issues.
 * 
 * Usage in browser console:
 *   import('/src/utils/devTools/translationAnalyzer.js').then(m => m.analyzeTranslations())
 */

import { analyzeTranslations } from './translation/analyzer';

// Expose the function globally in development
if (process.env.NODE_ENV !== 'production') {
  // @ts-expect-error
  window.__analyzeTranslations = analyzeTranslations;
  console.log('Translation analyzer tool available. Run window.__analyzeTranslations() to use it.');
}

export { analyzeTranslations };
export default { analyzeTranslations };
