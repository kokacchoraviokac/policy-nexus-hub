
import { User, UserRole } from "@/types/auth";

// Mock user data for development when not connected to Supabase
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@policyhub.com",
    role: "superAdmin" as UserRole,
    avatar: undefined,
  },
  {
    id: "2",
    name: "Broker Admin",
    email: "admin@example.com",
    role: "admin" as UserRole,
    companyId: "company1",
    avatar: undefined,
  },
  {
    id: "3",
    name: "Employee User",
    email: "employee@example.com",
    role: "employee" as UserRole,
    companyId: "company1",
    avatar: undefined,
  }
];
