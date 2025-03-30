
import * as XLSX from 'xlsx';
import { InvoiceType } from '@/types/finances';
import { formatDate } from '@/utils/format';

export const exportInvoicesToExcel = (
  invoices: InvoiceType[], 
  translations: Record<string, string>
) => {
  // Transform invoices data into a format suitable for Excel
  const exportData = invoices.map(invoice => {
    return {
      [translations['invoiceNumber'] || 'Invoice Number']: invoice.invoice_number,
      [translations['entityName'] || 'Entity Name']: invoice.entity_name,
      [translations['entityType'] || 'Entity Type']: invoice.entity_type || '',
      [translations['issueDate'] || 'Issue Date']: formatDate(new Date(invoice.issue_date)),
      [translations['dueDate'] || 'Due Date']: formatDate(new Date(invoice.due_date)),
      [translations['status'] || 'Status']: translations[invoice.status] || invoice.status,
      [translations['totalAmount'] || 'Total Amount']: invoice.total_amount,
      [translations['currency'] || 'Currency']: invoice.currency,
      [translations['invoiceType'] || 'Invoice Type']: invoice.invoice_type || 'domestic',
      [translations['invoiceCategory'] || 'Invoice Category']: invoice.invoice_category || 'automatic',
      [translations['calculationReference'] || 'Calculation Reference']: invoice.calculation_reference || '',
    };
  });

  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Create a workbook with the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
  
  // Generate the Excel file as a binary string
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Convert to Blob and trigger download
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoices_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
  
  return true;
};
