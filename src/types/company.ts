
import { CompanySeatsInfo } from "./auth/signup";

export { CompanySeatsInfo };

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
