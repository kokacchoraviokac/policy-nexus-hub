
export interface SalesProcess {
  id: string;
  title: string;
  client_name: string;
  company?: string;
  stage: SalesStage;
  status: SalesStatus;
  insurance_type: string;
  estimated_value?: number;
  expected_close_date?: string;
  lead_id?: string;
  assigned_to?: string;
  notes?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export type SalesStage = 'quote' | 'authorization' | 'request' | 'proposal' | 'receipt' | 'signed' | 'concluded';

export type SalesStatus = 'active' | 'won' | 'lost' | 'on_hold' | 'completed';

export interface CreateSalesProcessRequest {
  title: string;
  client_name: string;
  company?: string;
  insurance_type: string;
  estimated_value?: number;
  expected_close_date?: string;
  lead_id?: string;
  assigned_to?: string;
  notes?: string;
}

export interface UpdateSalesProcessRequest {
  title?: string;
  client_name?: string;
  company?: string;
  stage?: SalesStage;
  status?: SalesStatus;
  insurance_type?: string;
  estimated_value?: number;
  expected_close_date?: string;
  assigned_to?: string;
  notes?: string;
  current_step?: string;
}
