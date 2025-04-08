
import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date string using date-fns format
 * @param dateString Date string to format
 * @param formatString Format string (default: 'dd/MM/yyyy')
 * @param fallback Fallback string if date is invalid
 * @returns Formatted date string or fallback
 */
export function formatDate(
  dateString: string | null | undefined,
  formatString: string = 'dd/MM/yyyy',
  fallback: string = '-'
): string {
  if (!dateString) return fallback;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return fallback;
    
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Format a date and time string
 * @param dateString Date string to format
 * @param formatString Format string (default: 'dd/MM/yyyy HH:mm')
 * @param fallback Fallback string if date is invalid
 * @returns Formatted date and time string or fallback
 */
export function formatDateTime(
  dateString: string | null | undefined,
  formatString: string = 'dd/MM/yyyy HH:mm',
  fallback: string = '-'
): string {
  return formatDate(dateString, formatString, fallback);
}

/**
 * Format a number as currency
 * @param amount Number to format
 * @param currency Currency code (default: 'USD')
 * @param locale Locale string (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (amount === null || amount === undefined) return '-';
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Format a number with thousand separators
 * @param number Number to format
 * @param locale Locale string (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumber(
  number: number | string | null | undefined,
  locale: string = 'en-US'
): string {
  if (number === null || number === undefined) return '-';
  
  const numericValue = typeof number === 'string' ? parseFloat(number) : number;
  
  if (isNaN(numericValue)) return '-';
  
  return new Intl.NumberFormat(locale).format(numericValue);
}

/**
 * Format a percentage value
 * @param value Percentage value (0-100)
 * @param decimalPlaces Number of decimal places (default: 2)
 * @param locale Locale string (default: 'en-US')
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimalPlaces: number = 2,
  locale: string = 'en-US'
): string {
  if (value === null || value === undefined) return '-';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(numericValue / 100);
}

/**
 * Format a date string as relative time (e.g., "2 days ago")
 * @param dateString Date string to format
 * @param fallback Fallback string if date is invalid
 * @returns Relative time string or fallback
 */
export function formatRelativeTime(
  dateString: string | null | undefined,
  fallback: string = '-'
): string {
  if (!dateString) return fallback;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return fallback;
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return fallback;
  }
}

/**
 * Format a date range (e.g., "Jan 1, 2023 - Mar 15, 2023")
 * @param startDate Start date string
 * @param endDate End date string
 * @param formatString Format string for individual dates
 * @param separator Separator between dates (default: ' - ')
 * @param fallback Fallback string if either date is invalid
 * @returns Formatted date range string or fallback
 */
export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  formatString: string = 'MMM d, yyyy',
  separator: string = ' - ',
  fallback: string = '-'
): string {
  if (!startDate || !endDate) return fallback;
  
  const formattedStartDate = formatDate(startDate, formatString, fallback);
  const formattedEndDate = formatDate(endDate, formatString, fallback);
  
  if (formattedStartDate === fallback || formattedEndDate === fallback) {
    return fallback;
  }
  
  return `${formattedStartDate}${separator}${formattedEndDate}`;
}
