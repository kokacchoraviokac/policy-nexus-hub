
import { BaseEntity, EntityType, DocumentCategory } from "./common";

export interface Lead extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  contact_person?: string;
  source?: string;
  status: LeadStatus;
  notes?: string;
  assigned_to?: string;
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
  DORMANT = 'dormant'
}

export interface SalesProcess extends BaseEntity {
  lead_id?: string;
  sales_number?: string;
  estimated_value?: number;
  expected_close_date?: string;
  status: SalesProcessStatus;
  assigned_to?: string;
  current_step: string;
}

export enum SalesProcessStatus {
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ProposalStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export interface Proposal extends BaseEntity {
  title: string;
  client_id: string;
  client_name: string;
  sales_process_id: string;
  insurer_id: string;
  insurer_name: string;
  coverage_details: string;
  premium: number;
  currency: string;
  valid_until: string;
  status: ProposalStatus;
  notes?: string;
}
