
import { Proposal, ProposalStatus } from "@/types/sales";
import { ProposalStats } from "@/types/reports";

/**
 * Calculate statistics for proposals
 */
export function calculateProposalStats(proposals: Proposal[]): ProposalStats {
  const stats: ProposalStats = {
    total: proposals.length,
    accepted: 0,
    rejected: 0,
    pending: 0,
    draft: 0,
    sent: 0,
    viewed: 0
  };
  
  proposals.forEach(proposal => {
    if (proposal.status === 'accepted') {
      stats.accepted++;
    } else if (proposal.status === 'rejected') {
      stats.rejected++;
    } else if (proposal.status === 'draft') {
      stats.draft++;
      stats.pending++;
    } else if (proposal.status === 'sent') {
      stats.sent++;
      stats.pending++;
    } else if (proposal.status === 'viewed') {
      stats.viewed++;
      stats.pending++;
    } else if (proposal.status === 'expired') {
      stats.pending++;
    }
  });
  
  return stats;
}

/**
 * Get updated proposal with new status
 */
export function getUpdatedProposalWithStatus(
  proposal: Proposal, 
  newStatus: ProposalStatus
): Proposal {
  const now = new Date().toISOString();
  const updates: Partial<Proposal> = { status: newStatus };
  
  // Add appropriate timestamp based on status
  switch (newStatus) {
    case 'sent':
      updates.sent_at = now;
      break;
    case 'viewed':
      updates.viewed_at = now;
      break;
    case 'accepted':
      updates.accepted_at = now;
      break;
    case 'rejected':
      updates.rejected_at = now;
      break;
  }
  
  return { ...proposal, ...updates };
}

/**
 * Filter proposals by status
 */
export function filterProposals(proposals: Proposal[], status?: ProposalStatus): Proposal[] {
  if (!status || status === 'all') {
    return proposals;
  }
  
  return proposals.filter(proposal => proposal.status === status);
}
