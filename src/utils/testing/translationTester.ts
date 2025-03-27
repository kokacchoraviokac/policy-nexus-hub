import en from '../../locales/en.json';
import sr from '../../locales/sr.json';
import mk from '../../locales/mk.json';
import es from '../../locales/es.json';
import { Language } from '@/contexts/LanguageContext';
import { formatMissingTranslation } from '../translationValidator';

type TestResult = {
  passed: boolean;
  message: string;
};

type TestCaseResult = {
  testName: string;
  results: TestResult[];
};

type TranslationTestReport = {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testCases: TestCaseResult[];
};

/**
 * Tests if a translation exists for all languages
 */
const testTranslationExists = (key: string): TestResult[] => {
  const results: TestResult[] = [];
  const translations = { sr, mk, es };
  const languages = Object.keys(translations) as Language[];
  
  languages.forEach(lang => {
    const exists = Object.prototype.hasOwnProperty.call(translations[lang], key);
    results.push({
      passed: exists,
      message: exists 
        ? `Translation exists for "${key}" in ${lang.toUpperCase()}` 
        : `Missing translation for "${key}" in ${lang.toUpperCase()}`
    });
  });
  
  return results;
};

/**
 * Tests if a translation has format parameters (like {0}) in all languages
 */
const testTranslationParameters = (key: string): TestResult[] => {
  const results: TestResult[] = [];
  const translations = { en, sr, mk, es };
  const languages = Object.keys(translations) as Language[];
  
  // First check if English has any parameters
  const englishText = translations.en[key];
  if (!englishText) {
    return [{ passed: false, message: `Key "${key}" does not exist in English` }];
  }
  
  const paramRegex = /\{(\d+)\}/g;
  const englishParams = [...englishText.matchAll(paramRegex)].map(match => match[1]);
  
  if (englishParams.length === 0) {
    // No parameters to check
    return [{ passed: true, message: `No parameters found in "${key}"` }];
  }
  
  // Check if all other languages have the same parameters
  languages.forEach(lang => {
    const text = translations[lang][key];
    if (!text) {
      results.push({
        passed: false,
        message: `Translation missing for "${key}" in ${lang.toUpperCase()}`
      });
      return;
    }
    
    const langParams = [...text.matchAll(paramRegex)].map(match => match[1]);
    const missingParams = englishParams.filter(p => !langParams.includes(p));
    const extraParams = langParams.filter(p => !englishParams.includes(p));
    
    if (missingParams.length > 0 || extraParams.length > 0) {
      const missingParamsText = missingParams.length > 0 ? `Missing: {${missingParams.join('}, {')}} ` : '';
      const extraParamsText = extraParams.length > 0 ? `Extra: {${extraParams.join('}, {')}}` : '';
      
      results.push({
        passed: false,
        message: `Parameter mismatch in ${lang.toUpperCase()} for "${key}": ${missingParamsText}${extraParamsText}`.trim()
      });
    } else {
      results.push({
        passed: true,
        message: `Parameters match in ${lang.toUpperCase()} for "${key}"`
      });
    }
  });
  
  return results;
};

/**
 * Tests if a translation with HTML tags is consistent across all languages
 */
const testHtmlTranslations = (key: string): TestResult[] => {
  const results: TestResult[] = [];
  const translations = { en, sr, mk, es };
  const languages = Object.keys(translations) as Language[];
  
  // First check if English has any HTML tags
  const englishText = translations.en[key];
  if (!englishText) {
    return [{ passed: false, message: `Key "${key}" does not exist in English` }];
  }
  
  const htmlTagRegex = /<[^>]+>/g;
  const englishTags = englishText.match(htmlTagRegex) || [];
  
  if (englishTags.length === 0) {
    // No HTML tags to check
    return [{ passed: true, message: `No HTML tags found in "${key}"` }];
  }
  
  // Check if all other languages have the same HTML tags
  languages.forEach(lang => {
    if (lang === 'en') return; // Skip English as it's our reference
    
    const text = translations[lang][key];
    if (!text) {
      results.push({
        passed: false,
        message: `Translation missing for "${key}" in ${lang.toUpperCase()}`
      });
      return;
    }
    
    const langTags = text.match(htmlTagRegex) || [];
    const missingTags = englishTags.filter(tag => !langTags.includes(tag));
    const extraTags = langTags.filter(tag => !englishTags.includes(tag));
    
    if (missingTags.length > 0 || extraTags.length > 0) {
      results.push({
        passed: false,
        message: `HTML tag mismatch in ${lang.toUpperCase()} for "${key}": ` +
          (missingTags.length > 0 ? `Missing: ${missingTags.join(', ')} ` : '') +
          (extraTags.length > 0 ? `Extra: ${extraTags.join(', ')}` : '')
      });
    } else {
      results.push({
        passed: true,
        message: `HTML tags match in ${lang.toUpperCase()} for "${key}"`
      });
    }
  });
  
  return results;
};

/**
 * Runs all translation tests on every translation key
 */
export const runAllTranslationTests = (): TranslationTestReport => {
  const testCases: TestCaseResult[] = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  // Get all unique keys from all language files
  const allKeys = new Set([
    ...Object.keys(en),
    ...Object.keys(sr),
    ...Object.keys(mk),
    ...Object.keys(es)
  ]);
  
  // Test existence for all keys
  const existenceTestCase: TestCaseResult = {
    testName: 'Translation Existence',
    results: []
  };
  
  allKeys.forEach(key => {
    const results = testTranslationExists(key);
    existenceTestCase.results.push(...results);
    
    totalTests += results.length;
    passedTests += results.filter(r => r.passed).length;
    failedTests += results.filter(r => !r.passed).length;
  });
  
  testCases.push(existenceTestCase);
  
  // Test parameters for all English keys
  const parameterTestCase: TestCaseResult = {
    testName: 'Translation Parameters',
    results: []
  };
  
  Object.keys(en).forEach(key => {
    const results = testTranslationParameters(key);
    parameterTestCase.results.push(...results);
    
    totalTests += results.length;
    passedTests += results.filter(r => r.passed).length;
    failedTests += results.filter(r => !r.passed).length;
  });
  
  testCases.push(parameterTestCase);
  
  // Test HTML tags for all English keys
  const htmlTestCase: TestCaseResult = {
    testName: 'HTML Translation',
    results: []
  };
  
  Object.keys(en).forEach(key => {
    const results = testHtmlTranslations(key);
    htmlTestCase.results.push(...results);
    
    totalTests += results.length;
    passedTests += results.filter(r => r.passed).length;
    failedTests += results.filter(r => !r.passed).length;
  });
  
  testCases.push(htmlTestCase);
  
  return {
    totalTests,
    passedTests,
    failedTests,
    testCases
  };
};

/**
 * Validates a translation string for dynamic content
 */
export const validateDynamicTranslation = (
  translation: string, 
  params: Record<string, string | number>
): boolean => {
  const paramRegex = /\{(\d+|[a-zA-Z]+)\}/g;
  const requiredParams = [...translation.matchAll(paramRegex)].map(match => match[1]);
  
  // Check if all required parameters are provided
  return requiredParams.every(param => Object.prototype.hasOwnProperty.call(params, param));
};

/**
 * Process a translation string with dynamic parameters
 */
export const processDynamicTranslation = (
  translation: string,
  params: Record<string, string | number>
): string => {
  if (!translation) return formatMissingTranslation('missing');
  
  return translation.replace(/\{(\d+|[a-zA-Z]+)\}/g, (_, param) => {
    if (Object.prototype.hasOwnProperty.call(params, param)) {
      return String(params[param]);
    }
    return `{${param}}`;
  });
};

// Development utility function to run tests in the browser console
export const runTranslationTests = () => {
  if (process.env.NODE_ENV !== 'production') {
    const report = runAllTranslationTests();
    
    console.group('🧪 Translation Test Results');
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(`Passed: ${report.passedTests} (${Math.round((report.passedTests / report.totalTests) * 100)}%)`);
    console.log(`Failed: ${report.failedTests} (${Math.round((report.failedTests / report.totalTests) * 100)}%)`);
    
    report.testCases.forEach(testCase => {
      const failedResults = testCase.results.filter(r => !r.passed);
      if (failedResults.length > 0) {
        console.group(`⚠️ ${testCase.testName} - ${failedResults.length} failures`);
        failedResults.forEach(result => console.log(`❌ ${result.message}`));
        console.groupEnd();
      } else {
        console.log(`✅ ${testCase.testName} - All tests passed`);
      }
    });
    
    console.groupEnd();
    return report;
  }
  return null;
};

// Expose test runner globally in development
if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  window.__runTranslationTests = runTranslationTests;
  console.log('Translation test utility available. Run window.__runTranslationTests() to use it.');
}

export default { runTranslationTests, validateDynamicTranslation, processDynamicTranslation };
