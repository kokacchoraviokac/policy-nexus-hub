
export interface Lead {
  id: string;
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  source?: LeadSource;
  notes?: string;
  assigned_to?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  score?: number;
  
  // BANT criteria fields
  budget_score?: number;
  authority_score?: number;
  need_score?: number;
  timeline_score?: number;
  
  // Additional qualification data
  budget_notes?: string;
  authority_notes?: string;
  need_notes?: string;
  timeline_notes?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export type LeadSource = 'website' | 'referral' | 'email' | 'social_media' | 'phone' | 'event' | 'other';

export interface CreateLeadRequest {
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  source?: LeadSource;
  notes?: string;
  assigned_to?: string;
}

export interface UpdateLeadRequest {
  name?: string;
  company_name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
  assigned_to?: string;
  score?: number;
  budget_score?: number;
  authority_score?: number;
  need_score?: number;
  timeline_score?: number;
  budget_notes?: string;
  authority_notes?: string;
  need_notes?: string;
  timeline_notes?: string;
}
