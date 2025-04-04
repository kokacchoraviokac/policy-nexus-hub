
import { useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export interface PolicyReportFilters {
  startDate?: string;
  endDate?: string;
  insurerId?: string;
  clientId?: string;
  agentId?: string;
  policyType?: string;
  productId?: string;
  workflowStatus?: string;
}

export interface PolicyReportData {
  id: string;
  policy_number: string;
  start_date: string;
  expiry_date: string;
  client: string;
  insurer: string;
  premium: number;
  commission: number;
  agent: string;
  workflow_status: string;
  product: string;
}

export const usePolicyProductionReport = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<PolicyReportFilters>({});
  const [data, setData] = useState<PolicyReportData[]>([]);
  const [loading, setLoading] = useState(false);

  const { mutate: generateReport, isPending } = useMutation({
    mutationFn: async (reportFilters: PolicyReportFilters) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data based on filters
        const mockData: PolicyReportData[] = [];
        const startDate = reportFilters.startDate ? new Date(reportFilters.startDate) : new Date(2023, 0, 1);
        const endDate = reportFilters.endDate ? new Date(reportFilters.endDate) : new Date();
        
        // Sample workflow statuses
        const workflowStatuses = ['draft', 'in_review', 'ready', 'complete'];
        
        for (let i = 0; i < 30; i++) {
          const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
          const expiry = new Date(date);
          expiry.setFullYear(expiry.getFullYear() + 1);
          
          const workflowStatusFilter = reportFilters.workflowStatus || 'all';
          const randomStatus = workflowStatuses[Math.floor(Math.random() * workflowStatuses.length)];
          
          // Apply workflow status filter if specified
          if (workflowStatusFilter !== 'all' && workflowStatusFilter !== randomStatus) {
            continue;
          }
          
          mockData.push({
            id: `pol-${i}`,
            policy_number: `POL-2023-${1000 + i}`,
            start_date: date.toISOString().split('T')[0],
            expiry_date: expiry.toISOString().split('T')[0],
            client: `Client ${i + 1}`,
            insurer: `Insurer ${(i % 5) + 1}`,
            premium: Math.round(Math.random() * 1000) * 10,
            commission: Math.round(Math.random() * 100) * 10,
            agent: `Agent ${(i % 3) + 1}`,
            workflow_status: randomStatus,
            product: `Insurance Product ${(i % 8) + 1}`
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
        description: t("policyReportGenerated"),
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

  const updateFilters = useCallback((newFilters: Partial<PolicyReportFilters>) => {
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
