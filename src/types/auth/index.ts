
// Re-export only specific types to avoid ambiguity
export { User, UserRole, AuthState } from './user';

// Explicitly re-export CustomPrivilege to resolve ambiguity
import { CustomPrivilege as OriginalCustomPrivilege } from './user';
export { OriginalCustomPrivilege as CustomPrivilege };

// Export other types directly
export * from './roles';
export * from './privileges';
export * from './contextTypes';
