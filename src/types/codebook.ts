
import { BaseEntity } from "./common";

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

// Define the CodebookFilterState
export interface CodebookFilterState {
  status: string;
  [key: string]: any;
}

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
  category: ProductCategory;
  is_active: boolean;
  insurer_id?: string;
  insurer_name?: string;
  name_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
  category_translations?: Record<string, string>;
}

// Export types
export type { SavedFilter, Client, Insurer, InsuranceProduct, CodebookFilterState, ProductCategory, EntityStatus };
