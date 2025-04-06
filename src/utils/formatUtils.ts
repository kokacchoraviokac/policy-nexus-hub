
/**
 * Formats a number as currency with the given currency code
 */
export function formatCurrency(
  amount: number | string, 
  currencyCode = 'EUR', 
  locale = 'en-US'
): string {
  if (amount === null || amount === undefined) return '';
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return typeof amount === 'string' ? amount : '';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode
  }).format(numericAmount);
}

/**
 * Formats a number with the specified number of decimal places
 */
export function formatNumber(
  value: number | string, 
  decimalPlaces = 2, 
  locale = 'en-US'
): string {
  if (value === null || value === undefined) return '';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return typeof value === 'string' ? value : '';
  }
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(numericValue);
}

/**
 * Formats a percentage value
 */
export function formatPercentage(
  value: number | string, 
  decimalPlaces = 2, 
  locale = 'en-US'
): string {
  if (value === null || value === undefined) return '';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return typeof value === 'string' ? value : '';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(numericValue / 100); // Convert to decimal for percentage formatting
}

/**
 * Truncates text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength = 50): string {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats a file size in bytes to a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
