
/**
 * Format a date string to a localized format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number, currency: string = "EUR"): string => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${amount} ${currency}`;
  }
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined) return '';
  
  try {
    return `${value.toFixed(2)}%`;
  } catch (error) {
    console.error("Error formatting percentage:", error);
    return `${value}%`;
  }
};

/**
 * Format a phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // This is a simple example, could be expanded for different formats
  return phone;
};

/**
 * Truncate text to a specific length
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};
