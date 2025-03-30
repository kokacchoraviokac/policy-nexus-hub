
import { formatMissingTranslation } from '../../translationValidator';

/**
 * Validates a translation string for dynamic content
 */
export const validateDynamicTranslation = (
  translation: string, 
  params: Record<string, string | number>
): boolean => {
  const paramRegex = /\{(\d+|[a-zA-Z]+)\}/g;
  const requiredParams = Array.from(translation.matchAll(paramRegex)).map(match => match[1]);
  
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
