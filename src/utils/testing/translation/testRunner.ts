
import en from '../../../locales/en/index';
import sr from '../../../locales/sr/index';
import mk from '../../../locales/mk/index';
import es from '../../../locales/es/index';
import testTranslationExistence from './existenceTest';
import { testTranslationParameters } from './parameterTest';
import { testHtmlTranslations } from './htmlTest';
import { TestCaseResult, TranslationTestReport } from './types';
import { generateTranslationWorkflow } from '../../devTools/translation';

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
    const existenceTest = testTranslationExistence();
    const results = Object.entries(existenceTest.issues).flatMap(([lang, keys]) => {
      return keys.map(k => ({
        passed: !keys.includes(key),
        message: `Key "${key}" is missing in ${lang.toUpperCase()}`
      }));
    });
    
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
    const paramTest = testTranslationParameters();
    const results = Object.entries(paramTest.issues).flatMap(([lang, keys]) => {
      return keys.map(k => ({
        passed: !keys.includes(key),
        message: `Key "${key}" has inconsistent parameters in ${lang.toUpperCase()}`
      }));
    });
    
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
    const htmlTest = testHtmlTranslations();
    const results = Object.entries(htmlTest.issues).flatMap(([lang, keys]) => {
      return keys.map(k => ({
        passed: !keys.includes(key),
        message: `Key "${key}" has inconsistent HTML in ${lang.toUpperCase()}`
      }));
    });
    
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
