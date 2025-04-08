
import { format } from "date-fns";

/**
 * Format a date string using date-fns
 * @param date Date string or Date object
 * @param formatString Optional format string (default: 'yyyy-MM-dd')
 * @returns Formatted date string
 */
export const formatDateString = (date: string | Date, formatString: string = "yyyy-MM-dd"): string => {
  if (!date) return "-";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
};

/**
 * Format a date string with time using date-fns
 * @param date Date string or Date object
 * @param formatString Optional format string (default: 'yyyy-MM-dd HH:mm')
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date, formatString: string = "yyyy-MM-dd HH:mm"): string => {
  return formatDateString(date, formatString);
};

/**
 * Format a currency amount with the currency symbol
 * @param amount The amount to format
 * @param currency The currency code (e.g., USD, EUR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  if (amount === undefined || amount === null) {
    return "-";
  }
  
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${amount} ${currency}`;
  }
};

/**
 * Format a number with specified options
 * @param value The number to format
 * @param options Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export const formatNumber = (value: number, options: Intl.NumberFormatOptions = {}): string => {
  if (value === undefined || value === null) {
    return "-";
  }
  
  try {
    return new Intl.NumberFormat("en-US", options).format(value);
  } catch (error) {
    console.error("Error formatting number:", error);
    return String(value);
  }
};

/**
 * Format a percentage value
 * @param value The percentage value
 * @param decimalPlaces Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimalPlaces: number = 2): string => {
  if (value === undefined || value === null) {
    return "-";
  }
  
  return formatNumber(value, {
    style: "percent",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};
