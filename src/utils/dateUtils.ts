
/**
 * Formats a date string or Date object to a localized date string
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions for customizing the format
 * @returns The formatted date string
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  if (!date) return '';
  
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObject.getTime())) {
    console.warn(`Invalid date: ${date}`);
    return '';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObject);
}

/**
 * Formats a date to a localized format
 */
export function formatDateToLocal(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  return formatDate(date, options);
}

/**
 * Parses a date string into a Date object
 * @param dateString - The date string to parse
 * @returns A Date object
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  const parsedDate = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    console.warn(`Invalid date string: ${dateString}`);
    return null;
  }
  
  return parsedDate;
}

/**
 * Checks if a date is between two other dates
 * @param date - The date to check
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns True if the date is between the start and end dates
 */
export function isDateBetween(
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return dateObj >= startObj && dateObj <= endObj;
}

/**
 * Gets the start of a day
 * @param date - The date
 * @returns A new Date object set to the start of the day
 */
export function startOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Gets the end of a day
 * @param date - The date
 * @returns A new Date object set to the end of the day
 */
export function endOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}
