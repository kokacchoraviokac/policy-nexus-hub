
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FinancialTransaction, 
  FinancialReportFilters, 
  exportFinancialReportToCsv,
  calculateFinancialSummary
} from "@/utils/reports/financialReportUtils";

interface FinancialReportData {
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

export const useFinancialReport = (filters: FinancialReportFilters) => {
  const [isExporting, setIsExporting] = useState(false);

  const query = useQuery({
    queryKey: ['financial-report', filters],
    queryFn: async (): Promise<FinancialReportData> => {
      // Mock data for the financial report
      // In a real implementation, this would fetch from Supabase
      const mockTransactions: FinancialTransaction[] = [
        {
          id: '1',
          date: '2023-01-05',
          description: 'Commission payment for policy XYZ123',
          amount: 1200,
          type: 'income',
          category: 'commission',
          reference: 'COM-001',
          status: 'completed',
          currency: 'EUR'
        },
        {
          id: '2',
          date: '2023-01-10',
          description: 'Invoice #INV-456 payment received',
          amount: 2500,
          type: 'income',
          category: 'invoice',
          reference: 'INV-456',
          status: 'paid',
          currency: 'EUR'
        },
        {
          id: '3',
          date: '2023-01-15',
          description: 'Office supplies payment',
          amount: 300,
          type: 'expense',
          category: 'office',
          reference: 'EXP-001',
          status: 'completed',
          currency: 'EUR'
        },
        {
          id: '4',
          date: '2023-01-20',
          description: 'Commission payment for policy ABC789',
          amount: 850,
          type: 'income',
          category: 'commission',
          reference: 'COM-002',
          status: 'completed',
          currency: 'EUR'
        },
        {
          id: '5',
          date: '2023-01-25',
          description: 'Outstanding invoice #INV-789',
          amount: 1800,
          type: 'income',
          category: 'invoice',
          reference: 'INV-789',
          status: 'pending',
          currency: 'EUR'
        },
        {
          id: '6',
          date: '2023-01-30',
          description: 'Software subscription payment',
          amount: 500,
          type: 'expense',
          category: 'software',
          reference: 'EXP-002',
          status: 'completed',
          currency: 'EUR'
        }
      ];
      
      // Apply filters
      let filteredTransactions = [...mockTransactions];
      
      if (filters.startDate) {
        filteredTransactions = filteredTransactions.filter(
          t => new Date(t.date) >= filters.startDate!
        );
      }
      
      if (filters.endDate) {
        filteredTransactions = filteredTransactions.filter(
          t => new Date(t.date) <= filters.endDate!
        );
      }
      
      if (filters.transactionType && filters.transactionType !== 'all') {
        filteredTransactions = filteredTransactions.filter(
          t => t.type === filters.transactionType
        );
      }
      
      if (filters.category && filters.category !== 'all') {
        filteredTransactions = filteredTransactions.filter(
          t => t.category === filters.category
        );
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredTransactions = filteredTransactions.filter(
          t => 
            t.description.toLowerCase().includes(searchLower) ||
            t.reference?.toLowerCase().includes(searchLower)
        );
      }
      
      // Calculate summary data
      const incomeTx = filteredTransactions.filter(t => t.type === 'income');
      const expenseTx = filteredTransactions.filter(t => t.type === 'expense');
      const commissionTx = filteredTransactions.filter(t => t.category === 'commission' && t.type === 'income');
      const paidInvoiceTx = filteredTransactions.filter(t => t.category === 'invoice' && t.status === 'paid');
      const pendingInvoiceTx = filteredTransactions.filter(t => t.category === 'invoice' && t.status === 'pending');
      
      const totalIncome = incomeTx.reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = expenseTx.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        transactions: filteredTransactions,
        totalCount: filteredTransactions.length,
        summary: {
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses,
          commissionEarned: commissionTx.reduce((sum, t) => sum + t.amount, 0),
          invoicesPaid: paidInvoiceTx.reduce((sum, t) => sum + t.amount, 0),
          outstandingInvoices: pendingInvoiceTx.reduce((sum, t) => sum + t.amount, 0)
        }
      };
    }
  });

  const exportReport = async () => {
    if (!query.data?.transactions) return;
    
    setIsExporting(true);
    try {
      await exportFinancialReportToCsv(query.data.transactions);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  return {
    ...query,
    isExporting,
    exportReport
  };
};
