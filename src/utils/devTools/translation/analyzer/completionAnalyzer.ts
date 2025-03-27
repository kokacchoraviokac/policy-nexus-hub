
import { TranslationReport } from '../../../translationValidator';

/**
 * Generates a report on translation completion status
 */
export const generateCompletionReport = (report: TranslationReport) => {
  return {
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
  };
};
