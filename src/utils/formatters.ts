
import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date string to a localized date string
 * @param dateString ISO date string
 * @param formatStr Optional format string
 * @returns Formatted date string
 */
export const formatDateString = (dateString?: string | null, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a date to a localized date string
 * @param date Date object
 * @param formatStr Optional format string
 * @returns Formatted date string
 */
export const formatDate = (date?: Date | null, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!date || !isValid(date)) return '';
  
  try {
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a date string to a localized date and time string
 * @param dateString ISO date string
 * @param formatStr Optional format string
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString?: string | null, formatStr: string = 'dd/MM/yyyy HH:mm'): string => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return '';
  }
};

/**
 * Format a currency value
 * @param value Number to format
 * @param currency Currency code (default: EUR)
 * @param locale Locale to use for formatting (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value?: number | null,
  currency: string = 'EUR',
  locale: string = 'en-US'
): string => {
  if (value === undefined || value === null) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return value.toString();
  }
};

/**
 * Format a number with thousand separators
 * @param value Number to format
 * @param decimalPlaces Number of decimal places
 * @param locale Locale to use for formatting
 * @returns Formatted number string
 */
export const formatNumber = (
  value?: number | null,
  decimalPlaces: number = 2,
  locale: string = 'en-US'
): string => {
  if (value === undefined || value === null) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};

/**
 * Format a percentage value
 * @param value Number to format as percentage
 * @param decimalPlaces Number of decimal places
 * @param locale Locale to use for formatting
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value?: number | null,
  decimalPlaces: number = 2,
  locale: string = 'en-US'
): string => {
  if (value === undefined || value === null) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(value / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}%`;
  }
};
