
import { Proposal, ProposalStatus, ProposalStats } from '@/types/sales';

export const getDefaultProposalStats = (): ProposalStats => ({
  totalCount: 0,
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  total: 0,
  accepted: 0,
  rejected: 0,
  draft: 0,
  pending: 0,
  sent: 0,
  viewed: 0,
  approved: 0,
  expired: 0,
});

export const calculateProposalStats = (proposals: Proposal[]): ProposalStats => {
  const stats: ProposalStats = {
    totalCount: proposals.length,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    total: proposals.length,
    accepted: 0,
    rejected: 0,
    draft: 0,
    pending: 0,
    sent: 0,
    viewed: 0,
    approved: 0,
    expired: 0,
  };

  proposals.forEach(proposal => {
    const status = proposal.status.toLowerCase();
    
    switch (status) {
      case ProposalStatus.DRAFT.toLowerCase():
        stats.draft += 1;
        break;
      case ProposalStatus.SENT.toLowerCase():
        stats.sent += 1;
        break;
      case ProposalStatus.VIEWED.toLowerCase():
        stats.viewed += 1;
        break;
      case ProposalStatus.ACCEPTED.toLowerCase():
        stats.accepted += 1;
        break;
      case ProposalStatus.REJECTED.toLowerCase():
        stats.rejected += 1;
        stats.rejectedCount += 1;
        break;
      case ProposalStatus.APPROVED.toLowerCase():
        stats.approved += 1;
        stats.approvedCount += 1;
        break;
      case ProposalStatus.PENDING.toLowerCase():
        stats.pending += 1;
        stats.pendingCount += 1;
        break;
      case ProposalStatus.EXPIRED.toLowerCase():
        stats.expired += 1;
        break;
    }
  });

  return stats;
};

export const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' => {
  switch (status.toLowerCase()) {
    case ProposalStatus.DRAFT.toLowerCase():
      return 'outline';
    case ProposalStatus.SENT.toLowerCase():
      return 'secondary';
    case ProposalStatus.VIEWED.toLowerCase():
      return 'secondary';
    case ProposalStatus.ACCEPTED.toLowerCase():
      return 'success';
    case ProposalStatus.REJECTED.toLowerCase():
      return 'destructive';
    case ProposalStatus.APPROVED.toLowerCase():
      return 'success';
    case ProposalStatus.PENDING.toLowerCase():
      return 'warning';
    case ProposalStatus.EXPIRED.toLowerCase():
      return 'destructive';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
