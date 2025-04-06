
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Proposal, ProposalStatus, ProposalStats, UseProposalsDataProps } from '@/types/sales';
import { fromTable } from '@/utils/supabaseHelpers';

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
      // Use a safe query approach instead of type assertion
      // For now, we'll mock the data since "proposals" table may not exist
      // In a real implementation, replace this with proper Supabase queries
      
      // Mock proposal data
      const mockProposals: Proposal[] = [
        {
          id: '1',
          title: 'Auto Insurance Proposal',
          client_name: 'John Doe',
          sales_process_id: '123',
          created_at: new Date().toISOString(),
          status: 'pending',
          insurer_name: 'ABC Insurance'
        },
        {
          id: '2',
          title: 'Home Insurance Proposal',
          client_name: 'Jane Smith',
          sales_process_id: '456',
          created_at: new Date().toISOString(),
          status: 'approved',
          insurer_name: 'XYZ Insurance'
        }
      ];
      
      // Filter the mock data based on provided filters
      let filteredProposals = [...mockProposals];
      
      if (sales_process_id) {
        filteredProposals = filteredProposals.filter(p => p.sales_process_id === sales_process_id);
      }
      
      const status = statusFilter || legacyStatusFilter;
      if (status && status !== 'all') {
        filteredProposals = filteredProposals.filter(p => p.status === status);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProposals = filteredProposals.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.client_name.toLowerCase().includes(query)
        );
      }
      
      // Calculate stats
      const totalCount = filteredProposals.length;
      const pendingCount = filteredProposals.filter(item => item.status === 'pending').length;
      const approvedCount = filteredProposals.filter(item => item.status === 'approved').length;
      const rejectedCount = filteredProposals.filter(item => item.status === 'rejected').length;
      const draftCount = filteredProposals.filter(item => item.status === 'draft').length;
      const sentCount = filteredProposals.filter(item => item.status === 'sent').length;
      const viewedCount = filteredProposals.filter(item => item.status === 'viewed').length;
      const acceptedCount = filteredProposals.filter(item => item.status === 'accepted').length;
      
      setProposals(filteredProposals);
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
      // Mock update function - in reality would be a Supabase query
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, ...updates } : p));
      await fetchProposals(); // Refresh data
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
