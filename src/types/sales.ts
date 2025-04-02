
export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";

export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  salesProcessId: string;
  createdAt: string;
  sentAt?: string;
  viewedAt?: string;
  expiresAt?: string;
  status: ProposalStatus;
  insurerName?: string;
  coverageDetails?: string;
  premium?: string;
  notes?: string;
  documents?: string[];
}

export interface UseProposalsDataProps {
  salesProcessId?: string;
  clientName?: string;
  searchQuery?: string;
  statusFilter?: string;
}
