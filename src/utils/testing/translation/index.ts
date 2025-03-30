
import testTranslationExistence from './existenceTest';
import testTranslationParameters from './parameterTest';
import testHtmlTranslations from './htmlTest';

/**
 * Run all translation tests
 */
export const runTranslationTests = () => {
  // Test existence of translations
  const existenceResult = testTranslationExistence();
  
  // Test parameters in translations
  const parameterResult = testTranslationParameters();
  
  // Test HTML in translations
  const htmlResult = testHtmlTranslations();
  
  // Log results to console
  console.group('Translation Tests');
  
  console.log(`Existence Test: ${existenceResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
  if (!existenceResult.passed) {
    console.group('Missing Translations');
    Object.entries(existenceResult.issues).forEach(([lang, keys]) => {
      console.log(`${lang.toUpperCase()}: ${keys.length} missing keys`);
      console.log(keys);
    });
    console.groupEnd();
  }
  
  console.log(`Parameter Test: ${parameterResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
  if (!parameterResult.passed) {
    console.group('Inconsistent Parameters');
    Object.entries(parameterResult.issues).forEach(([lang, keys]) => {
      console.log(`${lang.toUpperCase()}: ${keys.length} keys with inconsistent parameters`);
      console.log(keys);
    });
    console.groupEnd();
  }
  
  console.log(`HTML Test: ${htmlResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
  if (!htmlResult.passed) {
    console.group('Inconsistent HTML');
    Object.entries(htmlResult.issues).forEach(([lang, keys]) => {
      console.log(`${lang.toUpperCase()}: ${keys.length} keys with inconsistent HTML`);
      console.log(keys);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return {
    existenceResult,
    parameterResult,
    htmlResult,
    allPassed: existenceResult.passed && parameterResult.passed && htmlResult.passed
  };
};

export default runTranslationTests;
