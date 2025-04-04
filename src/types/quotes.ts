
export type QuoteStatus = 'draft' | 'pending' | 'received' | 'selected' | 'rejected' | 'expired';

export interface Quote {
  id: string;
  salesProcessId: string;
  insurerName: string;
  amount: string;
  currency: string;
  coverageDetails: string;
  status: QuoteStatus;
  createdAt: string;
  sentAt?: string;
  responseReceivedAt?: string;
  expiresAt?: string;
  selectedAt?: string;
  rejectedAt?: string;
  notes?: string;
  coverageStartDate?: string;
  coverageEndDate?: string;
  policyNumber?: string;
  isPolicyImported?: boolean;
}

export interface QuoteRequest {
  salesProcessId: string;
  insurerName: string;
  coverageDetails: string;
  requestedAmount?: string;
  currency?: string;
  notes?: string;
  coverageStartDate?: string;
  coverageEndDate?: string;
}

export interface QuoteFilter {
  status?: QuoteStatus | 'all';
  insurerName?: string;
  salesProcessId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
