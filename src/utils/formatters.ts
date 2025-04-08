
import { format, parseISO } from 'date-fns';

/**
 * Format a date string to the specified format
 */
export const formatDate = (dateString: string | Date | null | undefined, formatStr: string = 'yyyy-MM-dd'): string => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateString);
  }
};

/**
 * Format a date and time string
 */
export const formatDateTime = (dateString: string | Date | null | undefined, formatStr: string = 'yyyy-MM-dd HH:mm'): string => {
  return formatDate(dateString, formatStr);
};

/**
 * Format a date string for display (alias for formatDate)
 */
export const formatDateString = formatDate;

/**
 * Format a currency value
 */
export const formatCurrency = (value: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a number with specified decimal places
 */
export const formatNumber = (value: number, decimalPlaces: number = 2, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Format a percentage value
 */
export const formatPercent = (value: number, decimalPlaces: number = 2, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value / 100);
};
