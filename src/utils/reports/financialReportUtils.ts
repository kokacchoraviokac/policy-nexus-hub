
// Financial report filter types
export interface FinancialReportFilters {
  dateRange: [Date | null, Date | null];
  entityType: string[];
  status: string[];
  amount: [number | null, number | null];
  transactionType: string[];
  category: string[];
  searchTerm: string;
  startDate: Date | null;
  endDate: Date | null;
}

// Default filter values
export const defaultFinancialFilters: FinancialReportFilters = {
  dateRange: [null, null],
  entityType: [],
  status: [],
  amount: [null, null],
  transactionType: [],
  category: [],
  searchTerm: "",
  startDate: null,
  endDate: null
};

// Mock data for testing financial reports
export interface FinancialTransaction {
  id: string;
  date: string;
  type: string;
  description: string;
  reference: string;
  amount: number;
  currency: string;
  entity_id?: string;
  entity_type?: string;
  status: string;
  category: string;
}

export interface FinancialReportData {
  id: string;
  date: string;
  type: string;
  description: string;
  reference: string;
  amount: number;
  currency: string;
  entity_id?: string;
  entity_type?: string;
  status: string;
  category: string;
  transactions: FinancialTransaction[];
}

// Helper to format currency
export const formatCurrency = (amount: number, currency: string = "EUR") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Mock financial transactions for demo purposes
export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: "1",
    date: "2025-03-01",
    type: "payment",
    description: "Premium payment",
    reference: "INV-2023-001",
    amount: 1250.00,
    currency: "EUR",
    entity_id: "policy-123",
    entity_type: "policy",
    status: "completed",
    category: "income"
  },
  {
    id: "2",
    date: "2025-02-15",
    type: "commission",
    description: "Commission payout",
    reference: "COM-2023-001",
    amount: 125.00,
    currency: "EUR",
    entity_id: "agent-456",
    entity_type: "agent",
    status: "completed",
    category: "expense"
  }
];

// Mock report data
export const mockFinancialReportData: FinancialReportData[] = [
  {
    id: "report-1",
    date: "2025-03-01",
    type: "payment",
    description: "Premium payments summary",
    reference: "",
    amount: 1250.00,
    currency: "EUR",
    status: "completed",
    category: "income",
    transactions: mockFinancialTransactions.filter(t => t.type === "payment")
  },
  {
    id: "report-2",
    date: "2025-02-15",
    type: "commission",
    description: "Commission payouts summary",
    reference: "",
    amount: 125.00,
    currency: "EUR",
    status: "completed",
    category: "expense",
    transactions: mockFinancialTransactions.filter(t => t.type === "commission")
  }
];
