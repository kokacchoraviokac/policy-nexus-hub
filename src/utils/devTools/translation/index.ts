
/**
 * Translation Manager - Development Tool
 * 
 * This utility helps manage translations across different language files.
 * It provides functions to:
 * 1. Export translation keys that need attention
 * 2. Import updated translations
 * 3. Track translation workflow status
 * 
 * Usage in browser console:
 *   import('/src/utils/devTools/translation').then(m => m.exportMissingTranslations())
 */

import { exportMissingTranslations } from './exportManager';
import { 
  generateTranslationWorkflow, 
  reportTranslationWorkflow,
  TranslationWorkflow,
  TranslationStatus 
} from './workflowManager';

// Create a global access point for the translation manager in development
if (process.env.NODE_ENV !== 'production') {
  // @ts-expect-error
  window.__translationManager = {
    exportMissingTranslations,
    generateTranslationWorkflow,
    reportTranslationWorkflow
  };
  
  console.log('Translation manager available. Use these functions in the console:');
  console.log('- window.__translationManager.exportMissingTranslations()');
  console.log('- window.__translationManager.reportTranslationWorkflow()');
}

// Export all functions
export {
  exportMissingTranslations,
  generateTranslationWorkflow,
  reportTranslationWorkflow
};

// Export types with 'export type' syntax for isolatedModules compliance
export type { TranslationWorkflow, TranslationStatus };

export default {
  exportMissingTranslations,
  generateTranslationWorkflow,
  reportTranslationWorkflow
};
