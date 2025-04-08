
/**
 * Formats a date string to locale date format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateString);
  }
}

/**
 * Formats a date string to locale date and time format
 * @param dateString Date string to format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return String(dateString);
  }
}

/**
 * Formats a number as currency
 * @param amount Amount to format
 * @param currency Currency code (default: EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | null | undefined, currency: string = 'EUR'): string {
  if (amount === null || amount === undefined || amount === '') return '';
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return String(amount);
  }
}

/**
 * Formats a number with commas as thousands separators
 * @param number Number to format
 * @returns Formatted number string
 */
export function formatNumber(number: number | string | null | undefined): string {
  if (number === null || number === undefined || number === '') return '';
  
  const numericValue = typeof number === 'string' ? parseFloat(number) : number;
  
  try {
    return new Intl.NumberFormat().format(numericValue);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(number);
  }
}

/**
 * Formats a percentage value
 * @param value Percentage value
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number | string | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || value === '') return '';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numericValue / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return String(value);
  }
}

/**
 * Truncates text to a specified length
 * @param text Text to truncate
 * @param maxLength Maximum length (default: 50)
 * @returns Truncated text
 */
export function truncateText(text: string | null | undefined, maxLength: number = 50): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Formats a file size in bytes to a human-readable format
 * @param bytes File size in bytes
 * @returns Human-readable file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
