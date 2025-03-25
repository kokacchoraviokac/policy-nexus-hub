
import { z } from "zod";
import { UserRole } from "./user";

export type CompanyOption = "existing" | "new" | "invitation";

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyOption: CompanyOption;
  companyId?: string;
  companyName?: string;
  invitationToken?: string;
}

export interface CompanySeatsInfo {
  id: string;
  hasAvailableSeats: boolean;
  usedSeats: number;
  seatsLimit: number;
}

export const createSignupSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, t("nameRequired")),
  email: z.string().email(t("invalidEmail")),
  password: z.string().min(6, t("passwordMinLength")),
  role: z.enum(["superAdmin", "admin", "employee"] as const),
  companyOption: z.enum(["existing", "new", "invitation"]),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  invitationToken: z.string().optional(),
}).refine((data) => {
  if (data.companyOption === "existing") {
    return !!data.companyId;
  }
  return true;
}, {
  message: "companyRequired",
  path: ["companyId"]
}).refine((data) => {
  if (data.companyOption === "new") {
    return !!data.companyName && data.companyName.length >= 2;
  }
  return true;
}, {
  message: "companyRequired",
  path: ["companyName"]
});
