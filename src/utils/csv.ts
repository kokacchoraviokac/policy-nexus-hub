
import { parse, unparse } from 'papaparse';

/**
 * Parse CSV file content into an array of objects
 */
export function parseCSV<T>(csvContent: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    parse(csvContent, {
      header: true,
      skipEmptyLines: true,
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
  const csv = unparse(data);
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
