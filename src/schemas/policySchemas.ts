
import { z } from "zod";
import {
  nameSchema,
  currencySchema,
  dateSchema,
  premiumSchema,
  percentageSchema,
  notesSchema,
} from "@/utils/formSchemas";

// Schema for the policy basic information tab
export const policyBasicInfoSchema = z.object({
  policy_number: z.string().min(1, { message: "Policy number is required" }),
  policy_type: z.string().min(1, { message: "Policy type is required" }),
  start_date: z.date({ required_error: "Start date is required" }),
  expiry_date: z.date({ required_error: "Expiry date is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  notes: z.string().optional(),
});

// Schema for the policy parties tab
export const policyPartiesSchema = z.object({
  client_id: z.string().min(1, { message: "Client is required" }),
  policyholder_name: z.string().min(1, { message: "Policyholder name is required" }),
  insurer_id: z.string().min(1, { message: "Insurer is required" }),
  insurer_name: z.string().min(1, { message: "Insurer name is required" }),
  insured_id: z.string().optional(),
  insured_name: z.string().optional(),
  product_id: z.string().optional(),
  product_name: z.string().optional(),
  product_code: z.string().optional(),
});

// Schema for the policy financial tab
export const policyFinancialSchema = z.object({
  premium: z.coerce.number().positive({ message: "Premium must be a positive number" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  payment_frequency: z.string().optional(),
  commission_type: z.string().optional(),
  commission_percentage: z.coerce.number().min(0).max(100).optional(),
});

// Combined schema for the entire policy form
export const policyFormSchema = policyBasicInfoSchema
  .merge(policyPartiesSchema)
  .merge(policyFinancialSchema);

export type PolicyFormValues = z.infer<typeof policyFormSchema>;
