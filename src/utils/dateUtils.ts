
/**
 * Utility functions for date formatting and manipulation
 */

export const formatDateToLocal = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTimeToLocal = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getLastNDays = (n: number): Date[] => {
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date);
  }
  return result;
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};
