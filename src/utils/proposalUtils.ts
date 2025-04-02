
import { Proposal, ProposalStatus } from "@/types/sales";

/**
 * Filters proposals based on search criteria
 */
export const filterProposals = (
  proposals: Proposal[], 
  salesProcessId?: string, 
  clientName?: string,
  searchQuery?: string, 
  statusFilter?: string
): Proposal[] => {
  return proposals.filter(proposal => {
    // Apply sales process filter if provided
    if (salesProcessId && proposal.salesProcessId !== salesProcessId) {
      return false;
    }
    
    // Apply client name filter if provided
    if (clientName && proposal.clientName !== clientName) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== "all" && proposal.status !== statusFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        proposal.title.toLowerCase().includes(query) ||
        proposal.clientName.toLowerCase().includes(query) ||
        (proposal.insurerName && proposal.insurerName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
};

/**
 * Calculates proposal stats by status
 */
export const calculateProposalStats = (proposals: Proposal[]): Record<string, number> => {
  return proposals.reduce((acc, proposal) => {
    acc[proposal.status] = (acc[proposal.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Updates proposal with new status and relevant timestamps
 */
export const getUpdatedProposalWithStatus = (
  proposal: Proposal, 
  status: ProposalStatus
): Proposal => {
  return {
    ...proposal,
    status,
    // Set additional timestamps based on status
    ...(status === "sent" ? { sentAt: new Date().toISOString() } : {}),
    ...(status === "viewed" ? { viewedAt: new Date().toISOString() } : {}),
    ...(["accepted", "rejected"].includes(status) ? { 
      expiresAt: undefined 
    } : {}),
    ...(status === "expired" ? { 
      expiresAt: new Date().toISOString() 
    } : {})
  };
};
