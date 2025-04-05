
import { FinancialReportFilters, FinancialReportData } from "@/types/reports";

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  reference: string;
  status: string;
}

export const getFilterQuery = (filters: FinancialReportFilters): string => {
  const conditions = [];
  
  if (filters.dateFrom) {
    conditions.push(`date >= '${filters.dateFrom}'`);
  }
  
  if (filters.dateTo) {
    conditions.push(`date <= '${filters.dateTo}'`);
  }
  
  if (filters.insurerId) {
    conditions.push(`insurer_id = '${filters.insurerId}'`);
  }
  
  if (filters.clientId) {
    conditions.push(`client_id = '${filters.clientId}'`);
  }
  
  if (filters.agentId) {
    conditions.push(`agent_id = '${filters.agentId}'`);
  }
  
  if (filters.type) {
    conditions.push(`type = '${filters.type}'`);
  }
  
  if (filters.status) {
    conditions.push(`status = '${filters.status}'`);
  }
  
  return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const summarizeTransactions = (data: FinancialReportData[]): {
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
} => {
  let totalAmount = 0;
  let pendingAmount = 0;
  let completedAmount = 0;
  
  for (const item of data) {
    totalAmount += item.amount;
    
    if (item.status === 'pending') {
      pendingAmount += item.amount;
    } else if (item.status === 'completed') {
      completedAmount += item.amount;
    }
  }
  
  return {
    totalAmount,
    pendingAmount,
    completedAmount
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
