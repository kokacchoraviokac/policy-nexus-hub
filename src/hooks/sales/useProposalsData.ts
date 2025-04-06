
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Proposal, ProposalStatus, ProposalStats } from '@/types/sales';

export const useProposalsData = (salesProcessId?: string, statusFilter?: ProposalStatus) => {
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
    approved: 0  // Added to satisfy TypeScript
  });

  const fetchProposals = async () => {
    setLoading(true);
    try {
      let query = supabase.from('proposals').select('*');
      
      if (salesProcessId) {
        query = query.eq('sales_process_id', salesProcessId);
      }
      
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Calculate stats
      const totalCount = data.length;
      const pendingCount = data.filter(item => item.status === 'pending').length;
      const approvedCount = data.filter(item => item.status === 'approved').length;
      const rejectedCount = data.filter(item => item.status === 'rejected').length;
      const draftCount = data.filter(item => item.status === 'draft').length;
      const sentCount = data.filter(item => item.status === 'sent').length;
      const viewedCount = data.filter(item => item.status === 'viewed').length;
      const acceptedCount = data.filter(item => item.status === 'accepted').length;
      
      setProposals(data as Proposal[]);
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
      const { error } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', proposalId);
        
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
  }, [salesProcessId, statusFilter]);

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
