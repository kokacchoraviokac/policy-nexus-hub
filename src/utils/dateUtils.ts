
import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param dateString - The date string to format
 * @param formatString - Optional format string (defaults to 'yyyy-MM-dd')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | Date, 
  formatString: string = 'yyyy-MM-dd'
): string => {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(dateString);
  }
};

/**
 * Format a date string to local format with time
 * @param dateString - The date string to format
 * @param formatString - Optional format string (defaults to 'yyyy-MM-dd HH:mm')
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  dateString: string | Date,
  formatString: string = 'yyyy-MM-dd HH:mm'
): string => {
  return formatDate(dateString, formatString);
};

/**
 * Format a date string to a local format (dependent on user's locale)
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDateToLocal = (dateString: string | Date): string => {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date to local:", error);
    return String(dateString);
  }
};

/**
 * Format a date to relative time (e.g., "2 days ago")
 * @param dateString - The date string to format
 * @returns Relative time string
 */
export const formatRelativeDate = (dateString: string | Date): string => {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return String(dateString);
  }
};
