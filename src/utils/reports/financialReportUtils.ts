
import { FinancialReportData, FinancialReportFilters } from "@/types/reports";
import { supabase } from "@/integrations/supabase/client";

export interface FinancialReportData {
  id: string;
  date: string;
  amount: number;
  type: string;
  category: string;
  status: string;
  reference?: string;
  entityId?: string;
  entityType?: string;
  entityName?: string;
}

export const fetchFinancialReportData = async (
  filters: FinancialReportFilters
): Promise<FinancialReportData[]> => {
  try {
    // Sample implementation - replace with actual data fetching logic
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .gte('issue_date', filters.dateFrom)
      .lte('issue_date', filters.dateTo);

    if (invoicesError) {
      console.error('Error fetching invoice data:', invoicesError);
      return [];
    }

    // Transform invoice data to FinancialReportData format
    const reportData: FinancialReportData[] = invoices.map((invoice: any) => ({
      id: invoice.id,
      date: invoice.issue_date,
      amount: invoice.total_amount,
      type: 'invoice',
      category: invoice.entity_type || 'client',
      status: invoice.status,
      reference: invoice.invoice_number,
      entityId: invoice.entity_id,
      entityType: invoice.entity_type,
      entityName: invoice.entity_name
    }));

    return reportData;
  } catch (error) {
    console.error('Error generating financial report:', error);
    return [];
  }
};

export const getDefaultFinancialReportFilters = (): FinancialReportFilters => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    searchTerm: '',
    dateFrom: firstDayOfMonth.toISOString().split('T')[0],
    dateTo: today.toISOString().split('T')[0],
    transactionType: 'all',
    category: 'all',
    status: 'all',
    entityType: 'all',
    startDate: firstDayOfMonth.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  };
};

export const exportFinancialReport = (data: FinancialReportData[], filters: FinancialReportFilters): void => {
  // Implementation for exporting report data to CSV or Excel
  console.log('Exporting financial report data', { data, filters });
  
  // Create a CSV string
  const headers = ['Date', 'Reference', 'Type', 'Category', 'Entity', 'Amount', 'Status'];
  const csvRows = [headers];
  
  // Add data rows
  data.forEach(item => {
    csvRows.push([
      item.date,
      item.reference || '',
      item.type,
      item.category,
      item.entityName || '',
      item.amount.toString(),
      item.status
    ]);
  });
  
  // Convert to CSV string
  const csvString = csvRows.map(row => row.join(',')).join('\n');
  
  // Create a download link
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financial-report-${filters.dateFrom}-to-${filters.dateTo}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
