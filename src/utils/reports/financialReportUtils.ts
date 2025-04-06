
import { FinancialReportData, FinancialReportFilters } from "@/types/reports";

// Define FinancialTransaction type
export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  status: string;
  paymentMethod?: string;
  reference?: string;
  relatedEntity?: {
    id: string;
    type: string;
    name: string;
  };
}

// Default filters for financial reports
export const defaultFinancialFilters: FinancialReportFilters = {
  searchTerm: "",
  dateFrom: "",
  dateTo: "",
  transactionType: "all",
  category: "all",
  status: "all",
  entityType: "all",
  // Aliases
  startDate: "",
  endDate: ""
};

// Function to fetch financial report data
export const fetchFinancialReportData = async (filters: FinancialReportFilters): Promise<FinancialReportData[]> => {
  // In a real app, this would make API calls to fetch data based on filters
  // Mock implementation for now
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          date: "2023-01-15",
          amount: 1500,
          type: "invoice",
          category: "premium",
          status: "paid",
          entityName: "ABC Corporation",
          entityType: "client",
          entityId: "client-123",
          reference: "INV-2023-001",
          description: "Premium payment"
        },
        {
          id: "2",
          date: "2023-02-10",
          amount: 750,
          type: "commission",
          category: "income",
          status: "received",
          entityName: "XYZ Insurance",
          entityType: "insurer",
          entityId: "insurer-456",
          reference: "COM-2023-002",
          description: "Commission payment"
        }
      ]);
    }, 500);
  });
};

// Format currency with the proper symbol
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
  });
  
  return formatter.format(amount);
};

// Calculate totals from financial data
export const calculateTotals = (data: FinancialReportData[]): { income: number; expenses: number; balance: number } => {
  return data.reduce(
    (acc, transaction) => {
      if (transaction.type === "income" || transaction.type === "commission") {
        acc.income += transaction.amount;
      } else if (transaction.type === "expense") {
        acc.expenses += transaction.amount;
      }
      
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
};

// Filter financial data based on filters
export const filterFinancialData = (
  data: FinancialReportData[],
  filters: FinancialReportFilters
): FinancialReportData[] => {
  return data.filter(item => {
    // Search term filter
    if (
      filters.searchTerm &&
      !item.reference?.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
      !item.entityName?.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) {
      return false;
    }
    
    if (filters.dateTo && new Date(item.date) > new Date(filters.dateTo)) {
      return false;
    }
    
    // Type filter
    if (filters.transactionType !== "all" && item.type !== filters.transactionType) {
      return false;
    }
    
    // Category filter
    if (filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    
    // Status filter
    if (filters.status !== "all" && item.status !== filters.status) {
      return false;
    }
    
    // Entity type filter
    if (filters.entityType !== "all" && item.entityType !== filters.entityType) {
      return false;
    }
    
    return true;
  });
};
