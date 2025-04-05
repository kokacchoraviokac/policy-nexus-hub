
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { utils, writeFileXLSX } from 'xlsx';

export interface FinancialReportData {
  id: string;
  date: string;
  description: string;
  type: string;
  reference: string;
  amount: number;
  currency: string;
  entity_id?: string;
  entity_type?: string;
  status?: string; // Add status field
}

export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  type?: string;
  entityType?: string;
  currency?: string;
  status?: string; // Add status field
}

export const useFinancialReport = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [data, setData] = useState<FinancialReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FinancialReportFilters>({
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
  });

  const updateFilters = useCallback((newFilters: Partial<FinancialReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Run the report with current filters
  const runReport = useCallback(async () => {
    setLoading(true);
    try {
      // Base query
      let query = supabase
        .from('financial_transactions')
        .select('*')
        .gte('date', filters.dateFrom)
        .lte('date', filters.dateTo);

      // Apply additional filters if they exist
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      
      if (filters.currency) {
        query = query.eq('currency', filters.currency);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Execute the query
      const { data, error } = await query.order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setData(data as FinancialReportData[]);
    } catch (error) {
      console.error('Error running financial report:', error);
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
      utils.book_append_sheet(wb, ws, 'Financial Report');
      
      // Generate file name with current date
      const fileName = `financial_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      
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
