
import * as XLSX from 'xlsx';

export const downloadToExcel = (data: any[], fileName: string) => {
  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Generate the Excel file and trigger download
  XLSX.writeFile(workbook, `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`);
};
