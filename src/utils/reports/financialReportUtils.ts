
import { FinancialReportFilters, FinancialReportData, FinancialTransaction } from "@/types/reports";

// Mock data for financial reports
export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: "1",
    date: "2023-01-15",
    type: "income",
    category: "commission",
    description: "Commission payment",
    reference: "INV-2023-001",
    amount: 1250.50,
    currency: "EUR",
    status: "completed"
  },
  {
    id: "2",
    date: "2023-01-20",
    type: "expense",
    category: "operational",
    description: "Office rent",
    reference: "RENT-JAN",
    amount: -800.00,
    currency: "EUR",
    status: "completed"
  },
  {
    id: "3",
    date: "2023-02-05",
    type: "income",
    category: "commission",
    description: "Commission payment",
    reference: "INV-2023-002",
    amount: 950.75,
    currency: "EUR",
    status: "completed"
  }
];

// Default filter values
export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // First day of current year
  dateTo: new Date().toISOString().split('T')[0], // Today
  transactionType: "",
  category: "",
  status: "",
  searchTerm: "",
  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
};

// Format currency value as string
export function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

// Get a color for a transaction type
export function getTransactionTypeColor(type: string): string {
  switch (type?.toLowerCase()) {
    case 'income':
      return 'text-green-600';
    case 'expense':
      return 'text-red-600';
    case 'transfer':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}

// Get summary stats from financial data
export function calculateFinancialSummary(data: FinancialReportData[]) {
  const income = data
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const expenses = data
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const balance = income + expenses; // expenses are negative
  
  const categorySummary = data.reduce((acc, item) => {
    const category = item.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += item.amount;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    income,
    expenses,
    balance,
    categorySummary
  };
}
