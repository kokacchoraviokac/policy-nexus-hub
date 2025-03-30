
import { UseQueryResult } from "@tanstack/react-query";

export interface ClaimsFilterOptions {
  searchTerm?: string;
  status?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface Claim {
  id: string;
  claim_number: string;
  policy_id: string;
  status: string;
  damage_description: string;
  incident_date: string;
  claimed_amount: number;
  approved_amount?: number;
  created_at: string;
  updated_at: string;
}

// You can extend this hook as needed with actual implementation
export const useClaims = (): {
  claims: Claim[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  filters: ClaimsFilterOptions;
  setFilters: (filters: ClaimsFilterOptions) => void;
} => {
  // Placeholder for actual implementation
  return {
    claims: [],
    isLoading: false,
    isError: false,
    refetch: () => {},
    filters: {},
    setFilters: () => {},
  };
};
