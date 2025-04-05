
/**
 * Format a date string to local date format
 * @param dateString The date string to format
 * @param locale The locale to use for formatting
 * @returns A formatted date string
 */
export const formatDateToLocal = (
  dateString: string | Date | null | undefined,
  locale = 'en-US'
): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date string to include time
 * @param dateString The date string to format
 * @param locale The locale to use for formatting
 * @returns A formatted date and time string
 */
export const formatDateTimeToLocal = (
  dateString: string | Date | null | undefined,
  locale = 'en-US'
): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get a relative time string (e.g., "2 days ago")
 * @param dateString The date string to format
 * @returns A relative time string
 */
export const getRelativeTimeString = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 30) {
    return formatDateToLocal(date);
  } else if (diffInDays > 0) {
    return rtf.format(-diffInDays, 'day');
  } else if (diffInHours > 0) {
    return rtf.format(-diffInHours, 'hour');
  } else if (diffInMinutes > 0) {
    return rtf.format(-diffInMinutes, 'minute');
  } else {
    return rtf.format(-diffInSeconds, 'second');
  }
};

/**
 * Calculate date range (e.g., last 7 days, last 30 days)
 * @param days Number of days to go back
 * @returns Object with start and end dates
 */
export const getDateRange = (days: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
};
