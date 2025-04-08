
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
