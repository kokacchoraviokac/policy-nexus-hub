
export type CommunicationDirection = 'inbound' | 'outbound';
export type CommunicationType = 'email' | 'sms' | 'call' | 'meeting' | 'note';
export type CommunicationStatus = 'draft' | 'sent' | 'failed' | 'delivered' | 'opened' | 'completed';

export interface CommunicationMetadata {
  [key: string]: any;
  recipientEmail?: string;
  recipientName?: string;
  attachments?: string[];
}

export interface Communication {
  id: string;
  lead_id: string;
  company_id: string;
  subject: string;
  content: string;
  direction: CommunicationDirection;
  type: CommunicationType;
  status: CommunicationStatus;
  sent_by: string;
  sent_at: string;
  template_id?: string;
  created_at: string;
  updated_at: string;
  email_metadata: CommunicationMetadata;
}
