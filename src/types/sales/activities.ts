
export type ActivityType = 
  | 'call'
  | 'email'
  | 'meeting'
  | 'follow_up'
  | 'task'
  | 'note';

export type ActivityStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'canceled';

export interface SalesActivity {
  id: string;
  activity_type: ActivityType;
  description: string;
  status: ActivityStatus;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  created_by: string;
  assigned_to?: string;
  lead_id?: string;
  sales_process_id?: string;
}

export interface CreateActivityFormData {
  activity_type: ActivityType;
  description: string;
  due_date?: Date;
  assigned_to?: string;
}
