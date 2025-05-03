
export interface SalesProcess {
  id: string;
  title: string;  // Mapped from sales_number in the database
  client_name: string;  // Currently using a placeholder
  company?: string;  // Currently using undefined
  stage: SalesStage;  // Mapped from current_step in the database
  status: SalesStatus;
  insurance_type: string;  // Currently using a default value
  estimated_value?: number;
  expected_close_date?: string;
  lead_id?: string;
  assigned_to?: string;
  notes?: string;  // This may not exist in the database, we're adding it to the type
  company_id: string;
  created_at: string;
  updated_at: string;
}

export type SalesStage = 'quote' | 'authorization' | 'request' | 'proposal' | 'receipt' | 'signed' | 'concluded';

export type SalesStatus = 'active' | 'won' | 'lost' | 'on_hold' | 'completed';

export interface CreateSalesProcessRequest {
  title: string;  // Will be mapped to sales_number in database
  client_name?: string;  // Not stored in database
  company?: string;  // Not stored in database
  insurance_type: string;  // Not stored in database
  estimated_value?: number;
  expected_close_date?: string;
  lead_id?: string;
  assigned_to?: string;
  notes?: string;
}

export interface UpdateSalesProcessRequest {
  title?: string;  // Will be mapped to sales_number in database
  client_name?: string;  // Not stored in database
  company?: string;  // Not stored in database
  stage?: SalesStage;  // Will be mapped to current_step in database
  status?: SalesStatus;
  insurance_type?: string;  // Not stored in database
  estimated_value?: number;
  expected_close_date?: string;
  assigned_to?: string;
  notes?: string;
  current_step?: string;  // Direct database field
}
