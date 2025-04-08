
import { BaseEntity } from "./common";
import { CodebookFilterState } from "./documents";

// Saved filter for codebook entities
export interface SavedFilter extends BaseEntity {
  name: string;
  entity_type: string;
  user_id: string;
  filters: CodebookFilterState;
}

// Product category
export type ProductCategory = 'life' | 'non-life';

// Codebook entity status
export type EntityStatus = 'active' | 'inactive';

// Re-export CodebookFilterState from documents.ts
export { CodebookFilterState } from "./documents";

// Client interface
export interface Client extends BaseEntity {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_active: boolean;
  tax_id?: string;
  registration_number?: string;
  notes?: string;
}

// Insurer interface
export interface Insurer extends BaseEntity {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  registration_number?: string;
  is_active: boolean;
  parent_company_id?: string;
  broker_code?: string;
}

// Insurance Product interface
export interface InsuranceProduct extends BaseEntity {
  code: string;
  name: string;
  english_name?: string;
  description?: string;
  category: 'life' | 'non-life';
  is_active: boolean;
  insurer_id?: string;
  insurer_name?: string;
  name_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
  category_translations?: Record<string, string>;
}
