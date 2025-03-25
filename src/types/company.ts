
import { CompanySeatsInfo } from "./auth/signup";

// Use 'export type' to avoid TS1205 error when 'isolatedModules' is enabled
export type { CompanySeatsInfo };

export interface Company {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  registrationNumber?: string;
  phone?: string;
  usedSeats?: number;
  seatsLimit?: number;
}
