
import { DocumentCategory, EntityType } from "./common";

export enum ProposalStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SENT = "sent",
  VIEWED = "viewed",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

export interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_id: string;
  insurer_name: string;
  insurer_id: string;
  sales_process_id: string;
  description: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  status: ProposalStatus;
  created_by: string;
  company_id: string;
  premium?: number;
  notes?: string;
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  is_latest?: boolean;
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  client_id: string;
  insurer_id: string;
  sales_process_id: string;
  amount: number;
  currency: string;
  status: ProposalStatus;
  premium?: number;
  notes?: string;
  expires_at?: string;
}
