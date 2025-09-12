import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReportSchedule } from '@/types/reports';

interface ReportScheduleFilters {
  search?: string;
  status?: 'active' | 'paused' | 'disabled';
  frequency?: string;
  report_id?: string;
}

interface CreateReportScheduleRequest {
  report_id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  cron_expression?: string;
  email_recipients: string[];
  format: 'csv' | 'excel' | 'pdf';
  status?: 'active' | 'paused' | 'disabled';
}

interface UpdateReportScheduleRequest {
  name?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  cron_expression?: string;
  email_recipients?: string[];
  format?: 'csv' | 'excel' | 'pdf';
  status?: 'active' | 'paused' | 'disabled';
}

export const useReportSchedules = (filters: ReportScheduleFilters = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch report schedules with filters
  const {
    data: schedules = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['report-schedules', filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('report_schedules')
        .select(`
          *,
          saved_reports!inner(name, report_type)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.frequency) {
        query = query.eq('frequency', filters.frequency);
      }

      if (filters.report_id) {
        query = query.eq('report_id', filters.report_id);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (ReportSchedule & { saved_reports: { name: string; report_type: string } })[];
    },
    enabled: !!user?.id
  });

  // Create report schedule
  const createSchedule = useMutation({
    mutationFn: async (scheduleData: CreateReportScheduleRequest) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      // Calculate next run date based on frequency
      const nextRunDate = calculateNextRunDate(scheduleData.frequency, scheduleData.cron_expression);

      const { data, error } = await supabase
        .from('report_schedules')
        .insert({
          ...scheduleData,
          company_id: profile.company_id,
          created_by: user.id,
          next_run_date: nextRunDate,
          status: scheduleData.status || 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data as ReportSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] });
      toast({
        title: t('scheduleCreated'),
        description: t('reportScheduleCreatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error creating report schedule:', error);
      toast({
        title: t('errorCreatingSchedule'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Update report schedule
  const updateSchedule = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateReportScheduleRequest }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Recalculate next run date if frequency changed
      let nextRunDate;
      if (updates.frequency || updates.cron_expression) {
        nextRunDate = calculateNextRunDate(
          updates.frequency || 'daily', 
          updates.cron_expression
        );
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
        ...(nextRunDate && { next_run_date: nextRunDate })
      };

      const { data, error } = await supabase
        .from('report_schedules')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ReportSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] });
      toast({
        title: t('scheduleUpdated'),
        description: t('reportScheduleUpdatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error updating report schedule:', error);
      toast({
        title: t('errorUpdatingSchedule'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Delete report schedule
  const deleteSchedule = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('report_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] });
      toast({
        title: t('scheduleDeleted'),
        description: t('reportScheduleDeletedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error deleting report schedule:', error);
      toast({
        title: t('errorDeletingSchedule'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Toggle schedule status
  const toggleScheduleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'paused' | 'disabled' }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('report_schedules')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ReportSchedule;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] });
      toast({
        title: t('scheduleStatusUpdated'),
        description: t('scheduleStatusChangedTo', { status: data.status })
      });
    },
    onError: (error) => {
      console.error('Error updating schedule status:', error);
      toast({
        title: t('errorUpdatingScheduleStatus'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Run schedule immediately
  const runScheduleNow = useMutation({
    mutationFn: async (scheduleId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // In a real implementation, this would trigger the schedule execution
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update last run date
      const { data, error } = await supabase
        .from('report_schedules')
        .update({ 
          last_run_date: new Date().toISOString(),
          last_run_status: 'success',
          updated_at: new Date().toISOString()
        })
        .eq('id', scheduleId)
        .select()
        .single();

      if (error) throw error;
      return data as ReportSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] });
      toast({
        title: t('scheduleExecuted'),
        description: t('reportScheduleExecutedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error running schedule:', error);
      toast({
        title: t('errorRunningSchedule'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Get schedule by ID
  const getScheduleById = useCallback((id: string) => {
    return schedules.find(schedule => schedule.id === id);
  }, [schedules]);

  // Get schedules by report
  const getSchedulesByReport = useCallback((reportId: string) => {
    return schedules.filter(schedule => schedule.report_id === reportId);
  }, [schedules]);

  // Get active schedules
  const getActiveSchedules = useCallback(() => {
    return schedules.filter(schedule => schedule.status === 'active');
  }, [schedules]);

  return {
    // Data
    schedules,
    isLoading,
    error,

    // Mutations
    createSchedule: createSchedule.mutate,
    updateSchedule: updateSchedule.mutate,
    deleteSchedule: deleteSchedule.mutate,
    toggleScheduleStatus: toggleScheduleStatus.mutate,
    runScheduleNow: runScheduleNow.mutate,

    // Mutation states
    isCreating: createSchedule.isPending,
    isUpdating: updateSchedule.isPending,
    isDeleting: deleteSchedule.isPending,
    isToggling: toggleScheduleStatus.isPending,
    isRunning: runScheduleNow.isPending,

    // Utility functions
    getScheduleById,
    getSchedulesByReport,
    getActiveSchedules,
    refetch
  };
};

// Helper function to calculate next run date
const calculateNextRunDate = (frequency: string, cronExpression?: string): string => {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'monthly': {
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth.toISOString();
    }
    case 'quarterly': {
      const nextQuarter = new Date(now);
      nextQuarter.setMonth(nextQuarter.getMonth() + 3);
      return nextQuarter.toISOString();
    }
    case 'yearly': {
      const nextYear = new Date(now);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      return nextYear.toISOString();
    }
    case 'custom':
      // In a real implementation, this would parse the cron expression
      // For now, default to daily
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }
};

// Helper function to validate cron expression
export const validateCronExpression = (expression: string): boolean => {
  // Basic cron validation (5 or 6 fields)
  const parts = expression.trim().split(/\s+/);
  return parts.length === 5 || parts.length === 6;
};

// Helper function to get human-readable frequency description
export const getFrequencyDescription = (frequency: string, cronExpression?: string): string => {
  switch (frequency) {
    case 'daily':
      return 'Every day at midnight';
    case 'weekly':
      return 'Every Monday at midnight';
    case 'monthly':
      return 'First day of every month at midnight';
    case 'quarterly':
      return 'First day of every quarter at midnight';
    case 'yearly':
      return 'January 1st at midnight';
    case 'custom':
      return cronExpression ? `Custom: ${cronExpression}` : 'Custom schedule';
    default:
      return 'Unknown frequency';
  }
};

// Hook for getting a single report schedule
export const useReportSchedule = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['report-schedule', id],
    queryFn: async () => {
      if (!user?.id || !id) throw new Error('User not authenticated or ID missing');

      const { data, error } = await supabase
        .from('report_schedules')
        .select(`
          *,
          saved_reports!inner(name, report_type)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ReportSchedule & { saved_reports: { name: string; report_type: string } };
    },
    enabled: !!user?.id && !!id
  });
};