
// Install dayjs if needed: npm install dayjs
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize dayjs plugins
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format a date to local date string
 */
export function formatDateToLocal(date: string | Date | null | undefined, format: string = "MMM D, YYYY"): string {
  if (!date) return "";
  
  try {
    return dayjs(date).format(format);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
}

/**
 * Format a date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  
  try {
    return dayjs(date).fromNow();
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return String(date);
  }
}

/**
 * Get the difference between two dates in days
 */
export function getDaysDifference(date1: string | Date, date2: string | Date = new Date()): number {
  return dayjs(date2).diff(dayjs(date1), "day");
}

/**
 * Check if a date is in the past
 */
export function isDateInPast(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs());
}

/**
 * Check if a date is in the future
 */
export function isDateInFuture(date: string | Date): boolean {
  return dayjs(date).isAfter(dayjs());
}

/**
 * Add days to a date
 */
export function addDays(date: string | Date, days: number): Date {
  return dayjs(date).add(days, "day").toDate();
}

/**
 * Format ISO date to localized date and time
 */
export function formatDateTime(date: string | Date | null | undefined, format: string = "MMM D, YYYY h:mm A"): string {
  if (!date) return "";
  
  try {
    return dayjs(date).format(format);
  } catch (error) {
    console.error("Error formatting date and time:", error);
    return String(date);
  }
}

/**
 * Simple alias for formatDateToLocal for backward compatibility
 */
export function formatDate(date: string | Date | null | undefined, format?: string): string {
  return formatDateToLocal(date, format);
}
