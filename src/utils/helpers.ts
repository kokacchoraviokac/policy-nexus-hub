
/**
 * Formats a date string to a localized display format
 * @param dateString 
 * @param locale 
 * @returns 
 */
export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text 
 * @param maxLength 
 * @returns 
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Generates a random ID for temporary use
 * @returns A random ID string
 */
export const generateTempId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Formats a number as currency
 * @param value 
 * @param currency 
 * @returns 
 */
export const formatCurrency = (value: number | string, currency: string = 'EUR'): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numValue);
};

/**
 * Capitalizes the first letter of a string
 * @param str 
 * @returns 
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
