
import { useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export interface FinancialReportFilters {
  startDate?: string;
  endDate?: string;
  insurerId?: string;
  clientId?: string;
  paymentStatus?: string;
  invoiceStatus?: string;
  commissionStatus?: string;
}

export interface FinancialReportData {
  id: string;
  date: string;
  client: string;
  insurer: string;
  policy: string;
  premium: number;
  commission: number;
  status: string;
  invoice: string;
}

export const useFinancialReport = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<FinancialReportFilters>({});
  const [data, setData] = useState<FinancialReportData[]>([]);
  const [loading, setLoading] = useState(false);

  const { mutate: generateReport, isPending } = useMutation({
    mutationFn: async (reportFilters: FinancialReportFilters) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Generate mock data based on filters
        const mockData: FinancialReportData[] = [];
        const startDate = reportFilters.startDate ? new Date(reportFilters.startDate) : new Date(2023, 0, 1);
        const endDate = reportFilters.endDate ? new Date(reportFilters.endDate) : new Date();
        
        for (let i = 0; i < 20; i++) {
          const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
          
          const paymentStatusFilter = reportFilters.paymentStatus || 'all';
          const invoiceStatusFilter = reportFilters.invoiceStatus || 'all';
          const commissionStatusFilter = reportFilters.commissionStatus || 'all';
          
          // Apply status filters
          const statuses = ['paid', 'pending', 'partial', 'overdue'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          if (paymentStatusFilter !== 'all' && paymentStatusFilter !== status) {
            continue;
          }
          
          if (invoiceStatusFilter !== 'all' && invoiceStatusFilter !== status) {
            continue;
          }
          
          if (commissionStatusFilter !== 'all' && commissionStatusFilter !== status) {
            continue;
          }
          
          mockData.push({
            id: `fin-${i}`,
            date: date.toISOString().split('T')[0],
            client: `Client ${i + 1}`,
            insurer: `Insurer ${(i % 5) + 1}`,
            policy: `POL-2023-${1000 + i}`,
            premium: Math.round(Math.random() * 1000) * 10,
            commission: Math.round(Math.random() * 100) * 10,
            status: status,
            invoice: `INV-2023-${2000 + i}`
          });
        }
        
        return mockData;
      } catch (error) {
        console.error("Error generating report:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (result) => {
      setData(result);
      toast({
        title: t("reportGenerated"),
        description: t("financialReportGenerated"),
      });
    },
    onError: (error) => {
      toast({
        title: t("reportError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  const updateFilters = useCallback((newFilters: Partial<FinancialReportFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const runReport = useCallback(() => {
    generateReport(filters);
  }, [generateReport, filters]);

  const exportToExcel = useCallback(() => {
    toast({
      title: t("exportStarted"),
      description: t("exportingToExcel"),
    });
    
    // Simulate export
    setTimeout(() => {
      toast({
        title: t("exportComplete"),
        description: t("reportExportedToExcel"),
      });
    }, 1500);
  }, [toast, t]);

  return {
    filters,
    updateFilters,
    runReport,
    data,
    loading: isPending || loading,
    exportToExcel
  };
};
