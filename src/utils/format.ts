
/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (e.g., "USD", "EUR")
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = "EUR"): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a human-readable format
 * @param dateString The date string to format
 * @param format The format style ("short", "medium", "long", "full")
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  format: "short" | "medium" | "long" | "full" = "medium"
): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: format 
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Format a percentage value
 * @param value The decimal value (e.g., 0.05 for 5%)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
