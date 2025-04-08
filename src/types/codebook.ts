
import { BaseEntity } from "./common";

// Filter state for codebook entities
export interface CodebookFilterState {
  status: 'all' | 'active' | 'inactive';
  country?: string;
  city?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Client types
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

// Insurer types
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

// Insurance Product types
export interface InsuranceProduct extends BaseEntity {
  code: string;
  name: string;
  english_name?: string;
  description?: string;
  category: 'life' | 'non-life';
  is_active: boolean;
  insurer_id?: string;
  insurer_name?: string;
}

// Contact Person types
export interface ContactPerson extends BaseEntity {
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary: boolean;
  entity_id: string;
  entity_type: 'client' | 'insurer';
}
