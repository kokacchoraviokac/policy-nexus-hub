
export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  is_default: boolean;
  company_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
