
import dayjs from 'dayjs';

/**
 * Format date to a locale friendly string
 * @param date Date or string to format
 * @param format Optional format string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | null, format: string = 'YYYY-MM-DD'): string => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Format date to a locale friendly string with time
 * @param date Date or string to format
 * @param format Optional format string
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string | null, format: string = 'YYYY-MM-DD HH:mm'): string => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Format date to a human-readable format for display in UI
 * @param date Date or string to format
 * @returns Formatted date string
 */
export const formatDateToLocal = (date: Date | string | null): string => {
  if (!date) return '';
  return dayjs(date).format('MMM DD, YYYY');
};

/**
 * Format date and time to a human-readable format for display in UI
 * @param date Date or string to format
 * @returns Formatted date and time string
 */
export const formatDateTimeToLocal = (date: Date | string | null): string => {
  if (!date) return '';
  return dayjs(date).format('MMM DD, YYYY HH:mm');
};

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns Boolean indicating if date is in the past
 */
export const isDateInPast = (date: Date | string): boolean => {
  return dayjs(date).isBefore(dayjs());
};

/**
 * Check if a date is today
 * @param date Date to check
 * @returns Boolean indicating if date is today
 */
export const isToday = (date: Date | string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Calculate the difference between two dates in days
 * @param dateA First date
 * @param dateB Second date (defaults to current date)
 * @returns Number of days difference
 */
export const daysDifference = (dateA: Date | string, dateB: Date | string = new Date()): number => {
  return dayjs(dateB).diff(dayjs(dateA), 'day');
};

/**
 * Convert a string date to a Date object
 * @param dateStr Date string
 * @returns Date object
 */
export const toDate = (dateStr: string): Date => {
  return dayjs(dateStr).toDate();
};
