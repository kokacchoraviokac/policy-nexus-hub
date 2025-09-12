import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  SavedReport,
  SavedReportWithDetails,
  CreateSavedReportRequest,
  UpdateSavedReportRequest,
  ReportExecutionRequest,
  ReportExecutionResult,
  ReportFilters,
  ReportColumn,
  ReportSorting,
  validateReportDefinition
} from '@/types/reports';

interface SavedReportsFilters {
  search?: string;
  report_type?: string;
  is_public?: boolean;
  created_by?: string;
  date_from?: string;
  date_to?: string;
}

export const useSavedReports = (filters: SavedReportsFilters = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch saved reports with filters
  const {
    data: reports = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['saved-reports', filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('saved_reports')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.report_type) {
        query = query.eq('report_type', filters.report_type);
      }

      if (filters.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }

      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to include parsed JSON fields
      return data.map(report => ({
        ...report,
        filters: (report.filters as any) || {},
        columns: (report.columns as any) || [],
        sorting: (report.sorting as any) || []
      })) as SavedReportWithDetails[];
    },
    enabled: !!user?.id
  });

  // Create saved report
  const createReport = useMutation({
    mutationFn: async (reportData: CreateSavedReportRequest) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Validate report definition
      const validationErrors = validateReportDefinition(reportData);
      if (validationErrors.length > 0) {
        throw new Error(`Report validation failed: ${validationErrors.join(', ')}`);
      }

      // Get user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      const { data, error } = await supabase
        .from('saved_reports')
        .insert({
          ...reportData,
          company_id: profile.company_id,
          created_by: user.id,
          filters: reportData.filters as any,
          columns: reportData.columns as any,
          sorting: reportData.sorting as any
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        filters: (data.filters as any) || {},
        columns: (data.columns as any) || [],
        sorting: (data.sorting as any) || []
      } as SavedReportWithDetails;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-reports'] });
      toast({
        title: t('reportCreated'),
        description: t('savedReportCreatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error creating saved report:', error);
      toast({
        title: t('errorCreatingReport'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Update saved report
  const updateReport = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateSavedReportRequest }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('saved_reports')
        .update({
          ...updates,
          filters: updates.filters as any,
          columns: updates.columns as any,
          sorting: updates.sorting as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        filters: (data.filters as any) || {},
        columns: (data.columns as any) || [],
        sorting: (data.sorting as any) || []
      } as SavedReportWithDetails;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-reports'] });
      toast({
        title: t('reportUpdated'),
        description: t('savedReportUpdatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error updating saved report:', error);
      toast({
        title: t('errorUpdatingReport'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Delete saved report
  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('saved_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-reports'] });
      toast({
        title: t('reportDeleted'),
        description: t('savedReportDeletedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error deleting saved report:', error);
      toast({
        title: t('errorDeletingReport'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Duplicate saved report
  const duplicateReport = useMutation({
    mutationFn: async (reportId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get the original report
      const { data: originalReport, error: fetchError } = await supabase
        .from('saved_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (fetchError) throw fetchError;

      // Get user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      // Create duplicate with modified name
      const duplicateData = {
        name: `${originalReport.name} (Copy)`,
        description: originalReport.description,
        report_type: originalReport.report_type,
        filters: originalReport.filters,
        columns: originalReport.columns,
        sorting: originalReport.sorting,
        is_public: false, // Duplicates are private by default
        company_id: profile.company_id,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('saved_reports')
        .insert(duplicateData)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        filters: (data.filters as any) || {},
        columns: (data.columns as any) || [],
        sorting: (data.sorting as any) || []
      } as SavedReportWithDetails;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-reports'] });
      toast({
        title: t('reportDuplicated'),
        description: t('savedReportDuplicatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error duplicating saved report:', error);
      toast({
        title: t('errorDuplicatingReport'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Execute report and get data
  const executeReport = useMutation({
    mutationFn: async (request: ReportExecutionRequest) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get the report definition
      const { data: report, error: reportError } = await supabase
        .from('saved_reports')
        .select('*')
        .eq('id', request.report_id)
        .single();

      if (reportError) throw reportError;

      // For now, we'll simulate report execution
      // In a real implementation, this would call a backend service or edge function
      const mockData = await simulateReportExecution(report, request);
      
      return mockData;
    },
    onError: (error) => {
      console.error('Error executing report:', error);
      toast({
        title: t('errorExecutingReport'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Simulate report execution (replace with real implementation)
  const simulateReportExecution = async (
    report: SavedReport, 
    request: ReportExecutionRequest
  ): Promise<ReportExecutionResult> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock data based on report type
    const mockData = generateMockReportData(report.report_type, 50);

    return {
      data: mockData,
      total_count: mockData.length,
      execution_time: Math.random() * 2000 + 500, // 500-2500ms
      generated_at: new Date().toISOString(),
      format: request.format
    };
  };

  // Generate mock data for testing
  const generateMockReportData = (reportType: string, count: number): any[] => {
    const data: any[] = [];
    
    for (let i = 0; i < count; i++) {
      switch (reportType) {
        case 'policies':
          data.push({
            'Policy Number': `POL-2024-${String(i + 1).padStart(3, '0')}`,
            'Policyholder': `Client ${i + 1}`,
            'Insurer': ['ABC Insurance', 'XYZ Insurance', 'DEF Insurance'][i % 3],
            'Policy Type': ['Auto', 'Life', 'Property'][i % 3],
            'Premium': (Math.random() * 5000 + 1000).toFixed(2),
            'Currency': 'EUR',
            'Start Date': new Date(2024, 0, i + 1).toISOString().split('T')[0],
            'Expiry Date': new Date(2025, 0, i + 1).toISOString().split('T')[0],
            'Status': ['Active', 'Expired', 'Pending'][i % 3]
          });
          break;
        case 'claims':
          data.push({
            'Claim Number': `CLM-2024-${String(i + 1).padStart(3, '0')}`,
            'Policy Number': `POL-2024-${String(Math.floor(i / 2) + 1).padStart(3, '0')}`,
            'Claimant': `Client ${i + 1}`,
            'Incident Date': new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            'Claimed Amount': (Math.random() * 10000 + 500).toFixed(2),
            'Approved Amount': (Math.random() * 8000 + 400).toFixed(2),
            'Status': ['Pending', 'Approved', 'Rejected', 'Under Review'][i % 4]
          });
          break;
        default:
          data.push({
            'ID': i + 1,
            'Name': `Item ${i + 1}`,
            'Value': (Math.random() * 1000).toFixed(2),
            'Date': new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
          });
      }
    }
    
    return data;
  };

  // Get report by ID
  const getReportById = useCallback((id: string) => {
    return reports.find(report => report.id === id);
  }, [reports]);

  // Get reports by type
  const getReportsByType = useCallback((reportType: string) => {
    return reports.filter(report => report.report_type === reportType);
  }, [reports]);

  // Get public reports
  const getPublicReports = useCallback(() => {
    return reports.filter(report => report.is_public);
  }, [reports]);

  // Get user's reports
  const getUserReports = useCallback((userId?: string) => {
    const targetUserId = userId || user?.id;
    return reports.filter(report => report.created_by === targetUserId);
  }, [reports, user?.id]);

  return {
    // Data
    reports,
    isLoading,
    error,

    // Mutations
    createReport: createReport.mutate,
    updateReport: updateReport.mutate,
    deleteReport: deleteReport.mutate,
    duplicateReport: duplicateReport.mutate,
    executeReport: executeReport.mutate,

    // Mutation states
    isCreating: createReport.isPending,
    isUpdating: updateReport.isPending,
    isDeleting: deleteReport.isPending,
    isDuplicating: duplicateReport.isPending,
    isExecuting: executeReport.isPending,

    // Utility functions
    getReportById,
    getReportsByType,
    getPublicReports,
    getUserReports,
    refetch
  };
};

// Hook for getting a single saved report
export const useSavedReport = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['saved-report', id],
    queryFn: async () => {
      if (!user?.id || !id) throw new Error('User not authenticated or ID missing');

      const { data, error } = await supabase
        .from('saved_reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        filters: (data.filters as any) || {},
        columns: (data.columns as any) || [],
        sorting: (data.sorting as any) || []
      } as SavedReportWithDetails;
    },
    enabled: !!user?.id && !!id
  });
};

// Hook for report execution with caching
export const useReportExecution = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const executeReport = useMutation({
    mutationFn: async (request: ReportExecutionRequest) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get the report definition
      const { data: report, error: reportError } = await supabase
        .from('saved_reports')
        .select('*')
        .eq('id', request.report_id)
        .single();

      if (reportError) throw reportError;

      // Execute the report (this would be a backend service in production)
      const result = await executeReportQuery(report, request);
      
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: t('reportExecuted'),
        description: t('reportExecutedSuccessfully', { 
          count: data.total_count,
          time: Math.round(data.execution_time)
        })
      });
    },
    onError: (error) => {
      console.error('Error executing report:', error);
      toast({
        title: t('errorExecutingReport'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  return {
    executeReport: executeReport.mutate,
    isExecuting: executeReport.isPending,
    executionResult: executeReport.data,
    executionError: executeReport.error
  };
};

// Helper function to execute report query (mock implementation)
const executeReportQuery = async (
  report: SavedReport,
  request: ReportExecutionRequest
): Promise<ReportExecutionResult> => {
  const startTime = Date.now();
  
  // Simulate database query execution
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
  
  // Generate mock data based on report type
  const mockData = generateMockData(report.report_type, request.limit || 100);
  
  const executionTime = Date.now() - startTime;
  
  return {
    data: mockData,
    total_count: mockData.length,
    execution_time: executionTime,
    generated_at: new Date().toISOString(),
    format: request.format
  };
};

// Generate mock data for different report types
const generateMockData = (reportType: string, count: number): any[] => {
  const data: any[] = [];
  
  for (let i = 0; i < count; i++) {
    switch (reportType) {
      case 'policies':
        data.push({
          id: i + 1,
          policy_number: `POL-2024-${String(i + 1).padStart(3, '0')}`,
          policyholder_name: `Client ${i + 1}`,
          insurer_name: ['ABC Insurance', 'XYZ Insurance', 'DEF Insurance'][i % 3],
          policy_type: ['Auto', 'Life', 'Property'][i % 3],
          premium: Math.random() * 5000 + 1000,
          currency: 'EUR',
          start_date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
          expiry_date: new Date(2025, 0, i + 1).toISOString().split('T')[0],
          status: ['Active', 'Expired', 'Pending'][i % 3]
        });
        break;
      case 'claims':
        data.push({
          id: i + 1,
          claim_number: `CLM-2024-${String(i + 1).padStart(3, '0')}`,
          policy_number: `POL-2024-${String(Math.floor(i / 2) + 1).padStart(3, '0')}`,
          claimant_name: `Client ${i + 1}`,
          incident_date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          claimed_amount: Math.random() * 10000 + 500,
          approved_amount: Math.random() * 8000 + 400,
          status: ['Pending', 'Approved', 'Rejected', 'Under Review'][i % 4]
        });
        break;
      case 'commissions':
        data.push({
          id: i + 1,
          policy_number: `POL-2024-${String(i + 1).padStart(3, '0')}`,
          agent_name: `Agent ${(i % 5) + 1}`,
          base_amount: Math.random() * 5000 + 1000,
          rate: Math.random() * 10 + 5,
          calculated_amount: Math.random() * 500 + 50,
          status: ['Due', 'Paid', 'Pending'][i % 3],
          payment_date: Math.random() > 0.5 ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : null
        });
        break;
      default:
        data.push({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: Math.random() * 1000,
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
        });
    }
  }
  
  return data;
};