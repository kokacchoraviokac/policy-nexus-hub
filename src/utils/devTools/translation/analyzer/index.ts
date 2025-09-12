
/**
 * Translation Analyzer - Development Tool
 * 
 * This utility analyzes translation files and finds issues.
 * 
 * Usage in browser console:
 *   import('/src/utils/devTools/translation/analyzer').then(m => m.analyzeTranslations())
 */

import { analyzeTranslations } from './analysisRunner';
import { generateCompletionReport } from './completionAnalyzer';
import { findConsistencyIssues } from './consistencyAnalyzer';

// Expose the analyzer globally in development
if (process.env.NODE_ENV !== 'production') {
  // @ts-expect-error
  window.__analyzeTranslations = analyzeTranslations;
  console.log('Translation analyzer tool available. Run window.__analyzeTranslations() to use it.');
}

export {
  analyzeTranslations,
  generateCompletionReport,
  findConsistencyIssues
};

export default { analyzeTranslations };
