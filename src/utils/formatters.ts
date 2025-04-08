
/**
 * Format a date string to localized format
 * @param dateString The date string to format
 * @param localeOptions Options for the date formatter
 */
export function formatDateString(
  dateString: string | null | undefined,
  localeOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, localeOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '';
  }
}

/**
 * Format number as currency
 * @param amount The amount to format
 * @param currency The currency code
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'EUR'
): string {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount} ${currency}`;
  }
}

/**
 * Format number with thousands separators and decimal places
 * @param number The number to format
 * @param decimals Number of decimal places
 */
export function formatNumber(
  number: number | null | undefined,
  decimals: number = 2
): string {
  if (number === null || number === undefined) return '';
  
  try {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return `${number}`;
  }
}

/**
 * Format percentage value
 * @param value The percentage value (e.g., 0.25 for 25%)
 * @param decimals Number of decimal places
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined) return '';
  
  try {
    // Convert to percentage format if the value is in decimal form
    const percentValue = value > 1 ? value : value * 100;
    
    return new Intl.NumberFormat(undefined, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}%`;
  }
}

/**
 * Format file size in human readable format
 * @param bytes Size in bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
