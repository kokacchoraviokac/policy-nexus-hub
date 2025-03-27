
/**
 * Generates suggestions for improving translations
 */
export const generateSuggestions = (): string[] => {
  return [
    'Fix missing translations, especially frequently used ones',
    'Standardize translation keys across all files',
    'Consider removing unused keys',
    'Run this report regularly as part of the development workflow'
  ];
};
