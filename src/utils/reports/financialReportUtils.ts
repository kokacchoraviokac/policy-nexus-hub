
import { formatCurrency, formatDate } from "@/utils/format";

export interface FinancialReportFilters {
  startDate?: Date;
  endDate?: Date;
  transactionType?: string;
  category?: string;
  searchTerm?: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  reference?: string;
  status: string;
  currency: string;
}

export interface FinancialReportData {
  transactions: FinancialTransaction[];
  totalCount: number;
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    commissionEarned: number;
    invoicesPaid: number;
    outstandingInvoices: number;
  };
}

/**
 * Generate an Excel-compatible CSV file from financial report data
 */
export const exportFinancialReportToCsv = (data: FinancialTransaction[], filename = "financial-report.csv") => {
  // Define CSV headers
  const headers = [
    "Date",
    "Description",
    "Amount",
    "Type",
    "Category",
    "Reference",
    "Status"
  ];
  
  // Map financial data to CSV rows
  const rows = data.map(transaction => [
    formatDate(new Date(transaction.date)),
    transaction.description,
    transaction.amount.toString(),
    transaction.type,
    transaction.category,
    transaction.reference || "",
    transaction.status
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => 
      // Escape special characters and wrap in quotes if needed
      cell.includes(",") || cell.includes("\"") || cell.includes("\n") 
        ? `"${cell.replace(/"/g, '""')}"` 
        : cell
    ).join(","))
  ].join("\n");
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Create a link element and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Calculate summary data from financial transactions
 */
export const calculateFinancialSummary = (transactions: FinancialTransaction[]) => {
  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    commissionEarned: 0,
    invoicesPaid: 0,
    outstandingInvoices: 0
  };

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
      
      if (transaction.category === 'commission') {
        summary.commissionEarned += transaction.amount;
      }
      
      if (transaction.category === 'invoice' && transaction.status === 'paid') {
        summary.invoicesPaid += transaction.amount;
      }
      
      if (transaction.category === 'invoice' && transaction.status === 'pending') {
        summary.outstandingInvoices += transaction.amount;
      }
    } else if (transaction.type === 'expense') {
      summary.totalExpenses += transaction.amount;
    }
  });

  summary.netIncome = summary.totalIncome - summary.totalExpenses;
  
  return summary;
};
