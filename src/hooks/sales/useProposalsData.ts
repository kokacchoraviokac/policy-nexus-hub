
import { useState, useEffect } from 'react';
import { Proposal, ProposalStatus, ProposalStats } from '@/types/sales';
import { getDefaultProposalStats, calculateProposalStats } from '@/utils/proposalUtils';
import { mockProposals } from '@/data/mockProposals';

interface UseProposalsDataProps {
  sales_process_id?: string;
  searchQuery?: string;
  statusFilter?: string;
}

export const useProposalsData = (props: UseProposalsDataProps = {}) => {
  const { sales_process_id, searchQuery, statusFilter } = props;
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState<ProposalStats>(getDefaultProposalStats());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // For display in components that need to categorize by status
  const [proposalsByStatus, setProposalsByStatus] = useState<Record<string, number>>({
    draft: 0,
    pending: 0,
    sent: 0,
    viewed: 0,
    accepted: 0,
    rejected: 0,
    approved: 0,
    expired: 0
  });
  
  const fetchProposals = async () => {
    setLoading(true);
    try {
      // This would be an API call in a real app
      let filteredProposals = [...mockProposals];
      
      if (sales_process_id) {
        filteredProposals = filteredProposals.filter(p => p.sales_process_id === sales_process_id);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProposals = filteredProposals.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.description?.toLowerCase().includes(query) ||
          p.client_name.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter && statusFilter !== 'all') {
        filteredProposals = filteredProposals.filter(p => 
          p.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }
      
      setProposals(filteredProposals);
      
      // Calculate stats
      const calculatedStats = calculateProposalStats(filteredProposals);
      setStats(calculatedStats);
      
      // Update proposalsByStatus for UI components that need it
      setProposalsByStatus({
        draft: calculatedStats.draft,
        pending: calculatedStats.pending,
        sent: calculatedStats.sent,
        viewed: calculatedStats.viewed,
        accepted: calculatedStats.accepted,
        rejected: calculatedStats.rejected,
        approved: calculatedStats.approved,
        expired: calculatedStats.expired
      });
      
      setError(null);
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProposals();
  }, [sales_process_id, searchQuery, statusFilter]);
  
  const refreshProposals = async () => {
    await fetchProposals();
  };
  
  const updateProposal = async (proposalId: string, updates: Partial<Proposal>): Promise<boolean> => {
    try {
      // This would be an API call in a real app
      const updatedProposals = proposals.map(p => 
        p.id === proposalId ? { ...p, ...updates } : p
      );
      
      setProposals(updatedProposals);
      
      // Recalculate stats
      const calculatedStats = calculateProposalStats(updatedProposals);
      setStats(calculatedStats);
      
      return true;
    } catch (error) {
      console.error("Error updating proposal:", error);
      return false;
    }
  };
  
  const updateProposalStatus = async (proposalId: string, newStatus: ProposalStatus): Promise<boolean> => {
    return updateProposal(proposalId, { status: newStatus });
  };
  
  return {
    proposals,
    stats,
    loading,
    error,
    refreshProposals,
    updateProposal,
    updateProposalStatus,
    proposalsByStatus
  };
};
