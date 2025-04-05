
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { utils, writeFileXLSX } from 'xlsx';

export interface PolicyReportData {
  id: string;
  policy_number: string;
  policy_type: string;
  insurer_name: string;
  policyholder_name: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  commission_amount: number | null;
  status: string;
  workflow_status: string;
}

export interface PolicyReportFilters {
  dateFrom: string;
  dateTo: string;
  expiryFrom?: string;
  expiryTo?: string;
  insurer_id?: string;
  client_id?: string;
  policy_type?: string;
  currency?: string;
  status?: string; // Add status field
}

export const usePolicyProductionReport = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [data, setData] = useState<PolicyReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<PolicyReportFilters>({
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
  });

  const updateFilters = useCallback((newFilters: Partial<PolicyReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Run the report with current filters
  const runReport = useCallback(async () => {
    setLoading(true);
    try {
      // Base query
      let query = supabase
        .from('policies')
        .select('*')
        .gte('start_date', filters.dateFrom)
        .lte('start_date', filters.dateTo);

      // Apply additional filters if they exist
      if (filters.expiryFrom) {
        query = query.gte('expiry_date', filters.expiryFrom);
      }
      
      if (filters.expiryTo) {
        query = query.lte('expiry_date', filters.expiryTo);
      }
      
      if (filters.insurer_id) {
        query = query.eq('insurer_id', filters.insurer_id);
      }
      
      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id);
      }
      
      if (filters.policy_type) {
        query = query.eq('policy_type', filters.policy_type);
      }
      
      if (filters.currency) {
        query = query.eq('currency', filters.currency);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Execute the query
      const { data, error } = await query.order('start_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setData(data as PolicyReportData[]);
    } catch (error) {
      console.error('Error running policy report:', error);
      toast({
        title: t('reportError'),
        description: typeof error === 'string' ? error : (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast, t]);

  // Export data to Excel
  const exportToExcel = useCallback(() => {
    if (data.length === 0) {
      toast({
        title: t('noDataToExport'),
        description: t('pleaseRunReportFirst'),
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create worksheet
      const ws = utils.json_to_sheet(data);
      
      // Create workbook
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Policy Production Report');
      
      // Generate file name with current date
      const fileName = `policy_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write and download
      writeFileXLSX(wb, fileName);
      
      toast({
        title: t('exportSuccess'),
        description: t('fileReadyForDownload'),
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: t('exportError'),
        description: typeof error === 'string' ? error : (error as Error).message,
        variant: 'destructive',
      });
    }
  }, [data, toast, t]);

  return {
    filters,
    updateFilters,
    runReport,
    data,
    loading,
    exportToExcel,
  };
};
