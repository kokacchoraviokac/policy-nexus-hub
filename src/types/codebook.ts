
export interface Client {
  id: string;
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  tax_id?: string | null;
  registration_number?: string | null;
  notes?: string | null;
  is_active: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface Insurer {
  id: string;
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  registration_number?: string | null;
  is_active: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface InsuranceProduct {
  id: string;
  code: string;
  name: string;
  category?: string | null;
  description?: string | null;
  is_active: boolean;
  insurer_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  insurer_name?: string; // For joining with insurer table
  // Multilingual fields
  name_translations?: Record<string, string> | null;
  description_translations?: Record<string, string> | null;
  category_translations?: Record<string, string> | null;
}

export type MultilingualProductField = 'name' | 'description' | 'category';

export interface CodebookFilterState {
  status?: 'all' | 'active' | 'inactive';
  city?: string;
  country?: string;
  category?: string;
  insurer?: string;
  createdAfter?: Date | null;
  createdBefore?: Date | null;
}

export interface SavedFilter {
  id: string;
  name: string;
  entity_type: 'insurers' | 'clients' | 'products';
  filters: CodebookFilterState;
  company_id: string;
  user_id: string;
  created_at: string;
}
