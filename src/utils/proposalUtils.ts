
import { Proposal, ProposalStatus, ProposalStats } from "@/types/sales";

export function getEmptyProposalStats(): ProposalStats {
  return {
    totalCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    // Legacy properties
    total: 0,
    accepted: 0,
    rejected: 0,
    draft: 0,
    pending: 0,
    sent: 0,
    viewed: 0,
    approved: 0
  };
}

export function calculateProposalStats(proposals: Proposal[]): ProposalStats {
  const stats = {
    totalCount: proposals.length,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    // Legacy properties
    total: proposals.length,
    accepted: 0,
    rejected: 0,
    draft: 0,
    pending: 0,
    sent: 0,
    viewed: 0,
    approved: 0
  };

  proposals.forEach(proposal => {
    const status = proposal.status.toLowerCase();
    
    if (status === 'approved') {
      stats.approvedCount++;
      stats.approved++;
    } else if (status === 'rejected') {
      stats.rejectedCount++;
      stats.rejected++;
    } else if (status === 'accepted') {
      stats.accepted++;
    } else if (status === 'draft') {
      stats.draft++;
    } else if (status === 'pending') {
      stats.pendingCount++;
      stats.pending++;
    } else if (status === 'sent') {
      stats.sent++;
    } else if (status === 'viewed') {
      stats.viewed++;
    }
  });

  return stats;
}

export function sortProposalsByStatus(proposals: Proposal[]): Record<string, Proposal[]> {
  const result: Record<string, Proposal[]> = {
    draft: [],
    sent: [],
    viewed: [],
    accepted: [],
    rejected: [],
    pending: [],
    all: [...proposals]
  };
  
  proposals.forEach(proposal => {
    const status = proposal.status.toLowerCase();
    if (result[status]) {
      result[status].push(proposal);
    }
  });
  
  return result;
}

export function getStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case 'draft':
      return 'Draft';
    case 'sent':
      return 'Sent';
    case 'viewed':
      return 'Viewed';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    case 'pending':
      return 'Pending';
    case 'approved':
      return 'Approved';
    default:
      return status;
  }
}

export function getProposalStatusCounts(proposals: Proposal[]): Record<string, number> {
  return {
    all: proposals.length,
    draft: proposals.filter(p => p.status.toLowerCase() === 'draft').length,
    sent: proposals.filter(p => p.status.toLowerCase() === 'sent').length,
    viewed: proposals.filter(p => p.status.toLowerCase() === 'viewed').length,
    accepted: proposals.filter(p => p.status.toLowerCase() === 'accepted').length,
    rejected: proposals.filter(p => p.status.toLowerCase() === 'rejected').length,
    pending: proposals.filter(p => p.status.toLowerCase() === 'pending').length,
    approved: proposals.filter(p => p.status.toLowerCase() === 'approved').length
  };
}
