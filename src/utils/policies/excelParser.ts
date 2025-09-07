import * as XLSX from 'xlsx';

export interface ExcelParseResult {
  data: any[];
  headers: string[];
  sheetName: string;
}

/**
 * Parse an Excel file and return structured data
 */
export const parseExcelFile = async (file: File): Promise<ExcelParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // Use first row as headers
          defval: '', // Default value for empty cells
          blankrows: false // Skip completely blank rows
        });

        if (jsonData.length === 0) {
          throw new Error('Excel file appears to be empty');
        }

        // Extract headers from first row
        const headers = jsonData[0] as string[];

        // Convert remaining rows to objects
        const dataRows = jsonData.slice(1).map((row: any) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });

        resolve({
          data: dataRows,
          headers,
          sheetName: firstSheetName
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the Excel file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Get all sheet names from an Excel file
 */
export const getExcelSheetNames = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(new Error(`Failed to read Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the Excel file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parse a specific sheet from an Excel file
 */
export const parseExcelSheet = async (file: File, sheetName: string): Promise<ExcelParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames.includes(sheetName)) {
          throw new Error(`Sheet "${sheetName}" not found in the Excel file`);
        }

        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: false
        });

        if (jsonData.length === 0) {
          throw new Error(`Sheet "${sheetName}" appears to be empty`);
        }

        // Extract headers from first row
        const headers = jsonData[0] as string[];

        // Convert remaining rows to objects
        const dataRows = jsonData.slice(1).map((row: any) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });

        resolve({
          data: dataRows,
          headers,
          sheetName
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel sheet: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the Excel file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Validate if a file is a valid Excel file
 */
export const isValidExcelFile = (file: File): boolean => {
  const validExtensions = ['.xlsx', '.xls', '.xlsm', '.xlsb'];
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
};

/**
 * Get file size limit for Excel files (50MB)
 */
export const EXCEL_FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB

/**
 * Check if Excel file size is within limits
 */
export const isValidExcelFileSize = (file: File): boolean => {
  return file.size <= EXCEL_FILE_SIZE_LIMIT;
};