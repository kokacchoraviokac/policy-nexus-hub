
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
}

export type LeadStatus = 'new' | 'qualified' | 'converted' | 'lost';

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
}
