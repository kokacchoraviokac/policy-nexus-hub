
import { Transaction } from "@/hooks/reports/useFinancialReport";

// Define the FinancialTransaction type for use in the report components
export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  type: string;
  category: string;
  amount: number;
  status: string;
  reference?: string;
  currency: string;
}

// Define the FinancialReportFilters interface
export interface FinancialReportFilters {
  startDate?: Date;
  endDate?: Date;
  transactionType?: string;
  category?: string;
  searchTerm?: string;
}

/**
 * Exports financial transactions to CSV format and triggers a download
 */
export const exportFinancialReportToCsv = (data: Transaction[], filename = "financial-report.csv") => {
  // Define CSV headers
  const headers = [
    "Date",
    "Description",
    "Type",
    "Category",
    "Amount",
    "Status",
    "Reference"
  ];
  
  // Map transaction data to CSV rows
  const rows = data.map(transaction => [
    transaction.date,
    transaction.description,
    transaction.type,
    transaction.category,
    transaction.amount.toString(),
    transaction.status,
    transaction.reference || ""
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

// Convert Transaction from useFinancialReport to FinancialTransaction
export const mapToFinancialTransaction = (transaction: Transaction): FinancialTransaction => {
  return {
    id: transaction.id,
    date: transaction.date,
    description: transaction.description,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    status: transaction.status,
    reference: transaction.reference,
    currency: "EUR" // Default currency, can be adjusted as needed
  };
};
