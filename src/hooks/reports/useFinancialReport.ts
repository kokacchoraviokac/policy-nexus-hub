
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  FinancialReportFilters, 
  FinancialTransaction, 
  FinancialReportData, 
  exportFinancialReportToCsv,
  calculateFinancialSummary
} from "@/utils/reports/financialReportUtils";

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
      
      if (filters.transactionType) {
        filteredTransactions = filteredTransactions.filter(
          t => t.type === filters.transactionType
        );
      }
      
      if (filters.category) {
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
      const summary = calculateFinancialSummary(filteredTransactions);
      
      return {
        transactions: filteredTransactions,
        totalCount: filteredTransactions.length,
        summary
      };
    }
  });

  const exportReport = async () => {
    if (!query.data?.transactions) return;
    exportFinancialReportToCsv(query.data.transactions);
  };

  return {
    ...query,
    isExporting,
    setIsExporting,
    exportReport
  };
};
