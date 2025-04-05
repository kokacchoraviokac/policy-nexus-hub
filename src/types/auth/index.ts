
// Re-export only specific types to avoid ambiguity
export type { User, UserRole, AuthState } from './user';

// Explicitly re-export CustomPrivilege to resolve ambiguity
import { CustomPrivilege as OriginalCustomPrivilege } from './user';
export type { OriginalCustomPrivilege as CustomPrivilege };

// Export other types directly
export type * from './roles';
export type * from './privileges';
export type * from './contextTypes';
