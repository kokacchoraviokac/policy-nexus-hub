
import { UserRole } from './userTypes';

export { UserRole };

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id: string;
  avatar?: string;
  companyId?: string; // Alias for backward compatibility
}
