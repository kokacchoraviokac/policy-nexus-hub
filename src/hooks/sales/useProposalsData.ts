
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Proposal, ProposalStatus, ProposalStats, UseProposalsDataProps } from '@/types/sales';
import { safeSupabaseQuery } from '@/utils/safeSupabaseQuery';

export const useProposalsData = ({ 
  sales_process_id, 
  status: statusFilter, 
  searchQuery, 
  statusFilter: legacyStatusFilter 
}: UseProposalsDataProps = {}) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<ProposalStats>({
    totalCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    
    // Legacy stats
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    draft: 0,
    sent: 0,
    viewed: 0,
    approved: 0
  });

  const fetchProposals = async () => {
    setLoading(true);
    try {
      // Use a safe type assertion with the helper function
      const { data, error } = await safeSupabaseQuery(
        async () => {
          let query = supabase.from('proposals').select('*');
          
          if (sales_process_id) {
            query = query.eq('sales_process_id', sales_process_id);
          }
          
          const status = statusFilter || legacyStatusFilter;
          if (status && status !== 'all') {
            query = query.eq('status', status);
          }
          
          if (searchQuery) {
            query = query.or(`title.ilike.%${searchQuery}%,client_name.ilike.%${searchQuery}%`);
          }
          
          return await query.order('created_at', { ascending: false });
        }
      );
      
      if (error) throw error;
      
      // Type-safe cast of the data array
      const typedData = data as Proposal[];
      
      // Calculate stats
      const totalCount = typedData.length;
      const pendingCount = typedData.filter(item => item.status === 'pending').length;
      const approvedCount = typedData.filter(item => item.status === 'approved').length;
      const rejectedCount = typedData.filter(item => item.status === 'rejected').length;
      const draftCount = typedData.filter(item => item.status === 'draft').length;
      const sentCount = typedData.filter(item => item.status === 'sent').length;
      const viewedCount = typedData.filter(item => item.status === 'viewed').length;
      const acceptedCount = typedData.filter(item => item.status === 'accepted').length;
      
      setProposals(typedData);
      setStats({
        totalCount,
        pendingCount,
        approvedCount,
        rejectedCount,
        
        // Legacy stats
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        draft: draftCount,
        sent: sentCount,
        viewed: viewedCount,
        accepted: acceptedCount
      });
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProposal = async (proposalId: string, updates: Partial<Proposal>) => {
    try {
      const { error } = await safeSupabaseQuery(
        async () => {
          return await supabase
            .from('proposals')
            .update(updates)
            .eq('id', proposalId);
        }
      );
      
      if (error) throw error;
      
      // Refresh data
      await fetchProposals();
      return true;
    } catch (err) {
      console.error('Error updating proposal:', err);
      return false;
    }
  };

  const updateProposalStatus = async (proposalId: string, newStatus: ProposalStatus) => {
    return updateProposal(proposalId, { status: newStatus });
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProposals();
  }, [sales_process_id, statusFilter, searchQuery, legacyStatusFilter]);

  const refreshProposals = async () => {
    await fetchProposals();
  };

  return {
    proposals,
    stats,
    loading,
    error,
    refreshProposals,
    updateProposal,
    updateProposalStatus
  };
};
