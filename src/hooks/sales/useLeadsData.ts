
import { useState, useCallback } from 'react';
import { useSupabaseClient } from '../useSupabaseClient';
import { Lead } from '@/types/sales/leads';

export const useLeadsData = (searchQuery?: string, statusFilter?: string) => {
  const supabase = useSupabaseClient();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadsByStatus, setLeadsByStatus] = useState<{[key: string]: number}>({});
  
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch leads from database
      // For now just a stub
      setLeads([]);
      setTotalLeads(0);
      setLeadsByStatus({});
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch leads'));
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, supabase]);
  
  const getLeadById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, profiles(name)')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Process profiles to get assigned_to_name
      let lead: Lead = {
        ...data,
        assigned_to_name: data.profiles ? data.profiles.name : undefined
      };
      
      return lead;
    } catch (error) {
      console.error('Error fetching lead by ID:', error);
      return null;
    }
  }, [supabase]);
  
  return {
    leads,
    isLoading,
    error,
    refresh,
    totalLeads,
    leadsByStatus,
    getLeadById
  };
};
