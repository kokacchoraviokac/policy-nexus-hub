
/**
 * Formats a date string into a localized format
 */
export function formatDate(dateString: string, locale = 'en-US'): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Formats a date string into a localized datetime format
 */
export function formatDateTime(dateString: string, locale = 'en-US'): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formats a date to ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date | string | null): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return typeof date === 'string' ? date : '';
  }
  
  return dateObj.toISOString().split('T')[0];
}

/**
 * Calculates days remaining from today to the given date
 */
export function daysRemaining(dateString: string): number {
  if (!dateString) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Checks if a date is in the past
 */
export function isPastDate(dateString: string): boolean {
  if (!dateString) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  return date < today;
}

/**
 * Gets the first day of the current month
 */
export function getFirstDayOfMonth(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

/**
 * Gets the last day of the current month
 */
export function getLastDayOfMonth(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
}
