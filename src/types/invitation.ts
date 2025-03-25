
export interface Invitation {
  id: string;
  email: string;
  role: string;
  company_id: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvitationRequest {
  email: string;
  role: string;
  company_id: string;
  expiry_days?: number;
}
