
import { User, UserRole } from "@/types/auth";

export interface Employee extends User {
  id: string;
  is_active?: boolean;
  department?: string;
  position?: string;
  phone?: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  position?: string;
}
