
import { User, UserRole } from "@/types/auth";

// Mock user data for development when not connected to Supabase
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@policyhub.com",
    role: "superAdmin" as UserRole,
    companyId: "550e8400-e29b-41d4-a716-446655440000",
    avatar: undefined,
  },
  {
    id: "2",
    name: "Broker Admin",
    email: "admin@example.com",
    role: "admin" as UserRole,
    companyId: "550e8400-e29b-41d4-a716-446655440000",
    avatar: undefined,
  },
  {
    id: "3",
    name: "Employee User",
    email: "employee@example.com",
    role: "employee" as UserRole,
    companyId: "550e8400-e29b-41d4-a716-446655440000",
    avatar: undefined,
  }
];
