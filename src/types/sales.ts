
export type SalesProcessStage = 
  | "discovery"
  | "quote"
  | "proposal"
  | "contract"
  | "closeout";

export interface SalesProcess {
  id: string;
  lead_id?: string;
  company_id: string;
  sales_number?: string;
  current_step: SalesProcessStage;
  status: string;
  assigned_to?: string;
  expected_close_date?: string;
  estimated_value?: number;
  created_at: string;
  updated_at: string;
}
