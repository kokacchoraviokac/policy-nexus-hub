/**
 * Format a date as a string using the specified locale
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  // Convert string to Date object if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format the date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Format a number as currency with the specified currency code
 */
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a number with commas for thousands
 */
export const formatNumber = (num: number, locale = 'en-US'): string => {
  if (num === undefined || num === null) return '';
  
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Truncate a string to a maximum length and add ellipsis
 */
export const truncateString = (str: string, maxLength = 50): string => {
  if (!str) return '';
  
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength)}...`;
};
