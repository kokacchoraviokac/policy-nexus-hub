export interface Quote {
  id: string;
  sales_process_id: string;
  insurer_id: string;
  insurer_name: string;
  quote_number?: string;
  coverage_details: string;
  premium_amount: number;
  currency: string;
  validity_period_days: number;
  special_conditions?: string;
  status: QuoteStatus;
  sent_at?: string;
  responded_at?: string;
  response_notes?: string;
  created_at: string;
  updated_at: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'responded' | 'accepted' | 'rejected' | 'expired';

export interface CreateQuoteRequest {
  sales_process_id: string;
  insurer_id: string;
  coverage_details: string;
  premium_amount: number;
  currency: string;
  validity_period_days: number;
  special_conditions?: string;
}

export interface QuoteResponse {
  quote_id: string;
  response: 'accepted' | 'rejected' | 'modified';
  modified_premium?: number;
  modified_conditions?: string;
  notes?: string;
}

export interface ClientQuoteSelection {
  sales_process_id: string;
  selected_quote_id: string;
  client_feedback?: string;
  selection_reason?: string;
}