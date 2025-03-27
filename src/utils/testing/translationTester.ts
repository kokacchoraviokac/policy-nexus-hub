
/**
 * This file serves as the main entry point for translation testing utilities
 * It exports functionality from the modular files in the translation/ directory
 */

import { runTranslationTests, runAllTranslationTests } from './translation/testRunner';
import { validateDynamicTranslation, processDynamicTranslation } from './translation/dynamicTranslation';

// Re-export the functions for backward compatibility
export { 
  runTranslationTests,
  runAllTranslationTests,
  validateDynamicTranslation, 
  processDynamicTranslation 
};

export default { 
  runTranslationTests, 
  validateDynamicTranslation, 
  processDynamicTranslation 
};
