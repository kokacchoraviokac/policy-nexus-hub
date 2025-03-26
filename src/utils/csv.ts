
import { parse, unparse } from 'papaparse';

/**
 * Parse CSV file content into an array of objects
 */
export function parseCSV<T>(csvContent: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value, field) => {
        // Handle boolean conversions from strings
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
          return true;
        } else if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') {
          return false;
        } else {
          return value;
        }
      },
      complete: (results) => {
        resolve(results.data as T[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Convert data to CSV format and trigger download
 */
export function exportToCSV<T>(data: T[], filename: string): void {
  // Pre-process data to format boolean values as Yes/No for readability
  const processedData = data.map(item => {
    const processed: any = {};
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'boolean') {
        processed[key] = value ? 'Yes' : 'No';
      } else {
        processed[key] = value;
      }
    }
    return processed;
  });

  const csv = unparse(processedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
