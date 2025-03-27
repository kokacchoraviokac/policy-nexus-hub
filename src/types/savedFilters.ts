
import { CodebookFilterState } from "./codebook";

export type EntityType = 'insurers' | 'clients' | 'products';

export interface SavedFilter {
  id: string;
  name: string;
  entity_type: EntityType;
  filters: string; // JSON string of CodebookFilterState
  user_id: string;
  company_id: string;
  created_at: string;
}
