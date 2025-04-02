
export type SalesProcessStage = 
  | "quote" 
  | "authorization" 
  | "proposal" 
  | "signed" 
  | "concluded";

export type SalesProcessStatus = "active" | "completed" | "canceled";

export interface SalesProcess {
  id: string;
  title: string;
  company?: string;
  client_name: string;
  stage: SalesProcessStage;
  created_at: string;
  expected_close_date?: string;
  insurance_type: string;
  responsible_person?: string;
  status: SalesProcessStatus;
  estimated_value?: string;
  notes?: string;
}

export interface UseSalesProcessDataProps {
  searchQuery?: string;
  stageFilter?: string;
}

export interface SalesProcessDataResult {
  salesProcesses: SalesProcess[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  totalProcesses: number;
  processesByStage: Record<string, number>;
}
