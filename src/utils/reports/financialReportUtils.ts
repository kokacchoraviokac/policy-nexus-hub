
import { FinancialReportData, FinancialReportFilters, FinancialTransaction } from "@/types/reports";

// Create default filter values
export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  dateTo: new Date(),
  entityType: [],
  transactionType: [],
  category: [],
  searchTerm: "",
  status: ""
};

// Dummy data for financial report (will be replaced with API calls)
export const financialReportData: FinancialReportData[] = [
  {
    id: "1",
    date: "2023-04-01",
    type: "income",
    description: "Commission payment",
    reference: "INV-001",
    amount: 2500,
    currency: "EUR",
    entity_id: "policy-123",
    entity_type: "policy",
    status: "completed",
    category: "commission",
    transactions: [
      {
        id: "t1",
        date: "2023-04-01",
        type: "income",
        description: "Policy commission",
        reference: "INV-001-1",
        amount: 1500,
        currency: "EUR",
        status: "completed",
        category: "commission"
      },
      {
        id: "t2",
        date: "2023-04-01",
        type: "income",
        description: "Bonus commission",
        reference: "INV-001-2",
        amount: 1000,
        currency: "EUR",
        status: "completed",
        category: "commission"
      }
    ]
  },
  {
    id: "2",
    date: "2023-04-15",
    type: "expense",
    description: "Agent payout",
    reference: "EXP-001",
    amount: 1000,
    currency: "EUR",
    entity_id: "agent-123",
    entity_type: "agent",
    status: "completed",
    category: "payout",
    transactions: [
      {
        id: "t3",
        date: "2023-04-15",
        type: "expense",
        description: "Agent commission payout",
        reference: "EXP-001-1",
        amount: 1000,
        currency: "EUR",
        status: "completed",
        category: "payout"
      }
    ]
  },
  {
    id: "3",
    date: "2023-04-20",
    type: "income",
    description: "Premium payment",
    reference: "INV-002",
    amount: 5000,
    currency: "EUR",
    entity_id: "policy-456",
    entity_type: "policy",
    status: "completed",
    category: "premium",
    transactions: [
      {
        id: "t4",
        date: "2023-04-20",
        type: "income",
        description: "Annual premium",
        reference: "INV-002-1",
        amount: 5000,
        currency: "EUR",
        status: "completed",
        category: "premium"
      }
    ]
  }
];

// This function would be replaced with an actual API call
export const fetchFinancialReports = (filters: FinancialReportFilters): Promise<FinancialReportData[]> => {
  return new Promise((resolve) => {
    // Filter the mock data based on filters
    setTimeout(() => {
      let filteredData = [...financialReportData];
      
      // Apply date filters
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filteredData = filteredData.filter(item => new Date(item.date) >= fromDate);
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        filteredData = filteredData.filter(item => new Date(item.date) <= toDate);
      }
      
      // Apply entity type filter
      if (filters.entityType && filters.entityType.length > 0) {
        filteredData = filteredData.filter(item => 
          filters.entityType.includes(item.entity_type || ''));
      }
      
      // Apply transaction type filter
      if (filters.transactionType && filters.transactionType.length > 0) {
        filteredData = filteredData.filter(item => 
          filters.transactionType.includes(item.type));
      }
      
      // Apply category filter
      if (filters.category && filters.category.length > 0) {
        filteredData = filteredData.filter(item => 
          filters.category.includes(item.category));
      }
      
      // Apply search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.description.toLowerCase().includes(searchLower) ||
          item.reference.toLowerCase().includes(searchLower)
        );
      }
      
      resolve(filteredData);
    }, 500);
  });
};
