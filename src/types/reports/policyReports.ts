
export interface PolicyReportFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  insurerId?: string;
  clientId?: string;
  agentId?: string;
  policyType?: string;
  status?: string; // Add status property
}

export interface PolicyReportItem {
  id: string;
  policyNumber: string;
  clientName: string;
  insurerName: string;
  agentName?: string;
  premium: number;
  startDate: string;
  endDate: string;
  status: string;
  policyType: string;
  isRenewed?: boolean;
}

export interface PolicySummary {
  totalPolicies: number;
  totalPremium: number;
  activeCount: number;
  expiredCount: number;
  renewedCount: number;
}
