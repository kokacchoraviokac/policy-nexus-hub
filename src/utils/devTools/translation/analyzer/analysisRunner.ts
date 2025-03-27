
import { generateTranslationReport } from '../../../translationValidator';
import { generateCompletionReport } from './completionAnalyzer';
import { findConsistencyIssues } from './consistencyAnalyzer';
import { generateSuggestions } from './suggestionGenerator';

/**
 * Main function to run a complete translation analysis
 */
export const analyzeTranslations = () => {
  const report = generateTranslationReport();
  
  console.group('🌐 Translation Analysis Report');
  
  // Display completion statistics
  const completionReport = generateCompletionReport(report);
  console.log(`📊 Translation Completion:`);
  console.table(completionReport);
  
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
  
  // Analyze consistency issues
  const consistencyIssues = findConsistencyIssues();
  console.group('🔍 Translation Consistency Issues');
  
  if (consistencyIssues.onlyInEnglish.length > 0) {
    console.log(`⚠️ ${consistencyIssues.onlyInEnglish.length} keys exist only in English but are missing in some other languages`);
  }
  
  if (consistencyIssues.notInEnglish.length > 0) {
    console.log(`⚠️ ${consistencyIssues.notInEnglish.length} keys exist in other languages but not in English`);
    console.table(consistencyIssues.notInEnglish);
  }
  
  console.groupEnd(); // Consistency Issues
  
  // Generate suggestions for improvement
  const suggestions = generateSuggestions();
  console.group('💡 Suggestions');
  suggestions.forEach((suggestion, index) => {
    console.log(`${index + 1}. ${suggestion}`);
  });
  console.groupEnd(); // Suggestions
  
  console.groupEnd(); // Translation Analysis Report
  
  return report;
};
