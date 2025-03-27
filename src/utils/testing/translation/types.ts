
/**
 * Common types used across translation testing utilities
 */

export type TestResult = {
  passed: boolean;
  message: string;
};

export type TestCaseResult = {
  testName: string;
  results: TestResult[];
};

export type TranslationTestReport = {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testCases: TestCaseResult[];
};
