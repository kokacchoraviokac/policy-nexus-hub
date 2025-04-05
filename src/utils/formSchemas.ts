
import { z } from "zod";

// Basic schemas
export const nameSchema = z.object({
  name: z.string().min(1, "Name is required")
});

export const emailSchema = z.object({
  email: z.string().email("Invalid email format")
});

export const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const confirmPasswordSchema = z.object({
  confirmPassword: z.string()
}).refine((data) => data.confirmPassword === passwordSchema.shape.password, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const phoneSchema = z.string().optional();

export const addressSchema = z.string().optional();

export const citySchema = z.string().optional();

export const postalCodeSchema = z.string().optional();

export const countrySchema = z.string().optional();

export const taxIdSchema = z.string().optional();

export const registrationNumberSchema = z.string().optional();

export const notesSchema = z.string().optional();

export const isActiveSchema = z.boolean().default(true);

export const currencySchema = z.string().min(1, "Currency is required");

export const dateSchema = z.string().optional();

export const premiumSchema = z.number().nonnegative("Premium must be a positive number");

export const percentageSchema = z.number().min(0).max(100, "Percentage must be between 0 and 100");

export const policyNumberSchema = z.string().min(1, "Policy number is required");

export const claimStatusSchema = z.enum([
  "in_processing", 
  "reported", 
  "accepted", 
  "rejected", 
  "partially_accepted", 
  "appealed", 
  "withdrawn"
]);

export const damageDescriptionSchema = z.string().min(1, "Damage description is required");

export const claimAmountSchema = z.number().positive("Claim amount must be a positive number");

// Factory function for creating model schemas
export const createModelSchema = <T extends z.ZodType<any, any>>(
  baseSchema: T,
  additionalFields: z.ZodRawShape = {}
) => {
  return baseSchema.extend(additionalFields);
};

// Extract schema types
export type NameSchema = z.infer<typeof nameSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type ConfirmPasswordSchema = z.infer<typeof confirmPasswordSchema>;
