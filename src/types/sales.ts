
import { BaseEntity } from "./common";

export enum ProposalStatus {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

export interface Lead extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  company?: string; // alias for company_name
  status: string;
  source?: string;
  assigned_to?: string;
  contact_person?: string;
  notes?: string;
  company_id: string;
}

export interface SalesProcess extends BaseEntity {
  lead_id?: string;
  sales_number?: string;
  status: string;
  current_step: string;
  assigned_to?: string;
  expected_close_date?: string;
  estimated_value?: number;
  company_id: string;
  updated_at: string;
  client_name?: string;
}

export interface Proposal extends BaseEntity {
  title: string;
  client_id: string;
  client_name: string;
  insurer_id: string;
  insurer_name: string;
  sales_process_id: string;
  status: ProposalStatus;
  amount?: number;
  premium: number;
  currency: string;
  coverage_details: string;
  valid_until: string;
  updated_by?: string;
  rejected_at?: string;
  accepted_at?: string;
  description?: string;
  company_id: string;
}

export interface ProposalStats {
  draft: number;
  sent: number;
  accepted: number;
  rejected: number;
  expired: number;
  approved: number;
  total: number;
}
