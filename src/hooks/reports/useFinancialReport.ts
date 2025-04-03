
import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialReportFilters } from "@/utils/reports/financialReportUtils";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: string;
  category: string;
  amount: number;
  status: string;
  reference?: string;
}

export interface FinancialReportData {
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    commissionEarned: number;
    invoicesPaid: number;
    outstandingInvoices: number;
  };
}

export const useFinancialReport = (filters: FinancialReportFilters): UseQueryResult<FinancialReportData> & {
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
} => {
  const [isExporting, setIsExporting] = useState(false);

  const query = useQuery({
    queryKey: ['financial-report', filters],
    queryFn: async () => {
      try {
        // Build commission query
        let commissionQuery = supabase
          .from('commissions')
          .select('id, calculated_amount, base_amount, rate, status, payment_date, created_at');
          
        // Build invoice query  
        let invoiceQuery = supabase
          .from('invoices')
          .select('id, total_amount, status, issue_date, due_date, created_at');
          
        // Apply date filters if provided
        if (filters.startDate) {
          commissionQuery = commissionQuery.gte('created_at', filters.startDate.toISOString());
          invoiceQuery = invoiceQuery.gte('created_at', filters.startDate.toISOString());
        }
        
        if (filters.endDate) {
          commissionQuery = commissionQuery.lte('created_at', filters.endDate.toISOString());
          invoiceQuery = invoiceQuery.lte('created_at', filters.endDate.toISOString());
        }
        
        // Apply status filters if provided
        if (filters.status && filters.status !== 'all') {
          commissionQuery = commissionQuery.eq('status', filters.status);
          invoiceQuery = invoiceQuery.eq('status', filters.status);
        }
        
        // Execute queries in parallel
        const [commissionResult, invoiceResult] = await Promise.all([
          commissionQuery,
          invoiceQuery
        ]);
        
        if (commissionResult.error) throw commissionResult.error;
        if (invoiceResult.error) throw invoiceResult.error;
        
        const commissions = commissionResult.data || [];
        const invoices = invoiceResult.data || [];
        
        // Prepare transactions from both data sources
        const transactions: Transaction[] = [
          ...commissions.map(comm => ({
            id: comm.id,
            date: comm.payment_date || comm.created_at,
            description: `Commission (${comm.rate}%)`,
            type: 'commission',
            category: 'income',
            amount: comm.calculated_amount,
            status: comm.status
          })),
          ...invoices.map(inv => ({
            id: inv.id,
            date: inv.issue_date || inv.created_at,
            description: `Invoice due ${inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'N/A'}`,
            type: 'invoice',
            category: 'income',
            amount: inv.total_amount,
            status: inv.status
          }))
        ];
        
        // Calculate summary metrics
        const totalIncome = transactions
          .filter(t => t.category === 'income' && t.status !== 'cancelled')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const totalExpenses = transactions
          .filter(t => t.category === 'expense' && t.status !== 'cancelled')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const commissionEarned = commissions
          .filter(c => c.status !== 'cancelled')
          .reduce((sum, c) => sum + c.calculated_amount, 0);
          
        const invoicesPaid = invoices
          .filter(i => i.status === 'paid')
          .reduce((sum, i) => sum + i.total_amount, 0);
          
        const outstandingInvoices = invoices
          .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
          .reduce((sum, i) => sum + i.total_amount, 0);
        
        return {
          transactions,
          summary: {
            totalIncome,
            totalExpenses,
            netIncome: totalIncome - totalExpenses,
            commissionEarned,
            invoicesPaid,
            outstandingInvoices
          }
        };
      } catch (error) {
        console.error("Error fetching financial report data:", error);
        toast.error("Failed to fetch financial report");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isExporting,
    setIsExporting
  };
};
