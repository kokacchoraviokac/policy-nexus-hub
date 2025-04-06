
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

// Format date to user's local timezone
export const formatDateToLocal = (
  date: string | Date | null | undefined,
  format: string = 'YYYY-MM-DD'
): string => {
  if (!date) return 'N/A';
  return dayjs(date).format(format);
};

// Format date with time
export const formatDateTime = (
  date: string | Date | null | undefined,
  format: string = 'YYYY-MM-DD HH:mm'
): string => {
  if (!date) return 'N/A';
  return dayjs(date).format(format);
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  return dayjs(date).fromNow();
};

// Check if a date is in the past
export const isDateInPast = (date: string | Date | null | undefined): boolean => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs());
};

// Check if a date is in the future
export const isDateInFuture = (date: string | Date | null | undefined): boolean => {
  if (!date) return false;
  return dayjs(date).isAfter(dayjs());
};

// Get formatted date for API calls (ISO format)
export const getISODateString = (date: Date | null): string | null => {
  if (!date) return null;
  return dayjs(date).toISOString();
};

// Add days to a date
export const addDaysToDate = (date: Date | string, days: number): Date => {
  return dayjs(date).add(days, 'day').toDate();
};

// Subtract days from a date
export const subtractDaysFromDate = (date: Date | string, days: number): Date => {
  return dayjs(date).subtract(days, 'day').toDate();
};

// Get start of day
export const getStartOfDay = (date: Date | string): Date => {
  return dayjs(date).startOf('day').toDate();
};

// Get end of day
export const getEndOfDay = (date: Date | string): Date => {
  return dayjs(date).endOf('day').toDate();
};

// Format date based on locale
export const formatDate = (
  date: string | Date | null | undefined,
  format: string = 'LL'
): string => {
  if (!date) return 'N/A';
  return dayjs(date).format(format);
};
