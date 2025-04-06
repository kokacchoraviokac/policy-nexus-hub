
/**
 * Format a date string to a localized date string
 */
export const formatDateToLocal = (dateString: string, locale = 'en-US'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date string to a localized date and time string
 */
export const formatDateTimeToLocal = (dateString: string, locale = 'en-US'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return dateString;
  }
};

/**
 * Get a relative time string (e.g., "2 days ago")
 */
export const getRelativeTimeString = (dateString: string, locale = 'en-US'): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Convert to seconds
    const diffSec = Math.round(diffMs / 1000);
    
    // Less than a minute
    if (diffSec < 60) {
      return 'just now';
    }
    
    // Less than an hour
    if (diffSec < 3600) {
      const minutes = Math.floor(diffSec / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    if (diffSec < 604800) {
      const days = Math.floor(diffSec / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Default to formatted date
    return formatDateToLocal(dateString, locale);
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return dateString;
  }
};

/**
 * Check if a date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  } catch (error) {
    console.error('Error checking if date is in past:', error);
    return false;
  }
};

/**
 * Check if a date is in the future
 */
export const isDateInFuture = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
};

/**
 * Add days to a date and return a new date
 */
export const addDaysToDate = (dateString: string, days: number): string => {
  try {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  } catch (error) {
    console.error('Error adding days to date:', error);
    return dateString;
  }
};

// Alias for backward compatibility
export const formatDate = formatDateToLocal;
