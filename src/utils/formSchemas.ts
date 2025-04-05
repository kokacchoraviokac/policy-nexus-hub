
import { z } from "zod";

// Basic schemas 
export const nameSchema = z.string().min(1, "Name is required");
export const emailSchema = z.string().email("Invalid email format");
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
export const confirmPasswordSchema = z.object({
  confirmPassword: z.string()
}).refine((data) => data.confirmPassword === passwordSchema._def.checks[0].value, {
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

// Factory function for creating model schemas that allows proper type checking
export const createModelSchema = (type: string, options: { isRequired?: boolean; errorMessage?: string } = {}) => {
  const baseSchema = z.string();
  if (options.isRequired) {
    return baseSchema.min(1, options.errorMessage || `${type} is required`);
  }
  return baseSchema.optional();
};

// Helper function to create schemas with translation function parameter
export const createNameSchema = (errorMessage: string) => nameSchema;
export const createEmailSchema = (errorMessage: string) => emailSchema;
export const createPhoneSchema = () => phoneSchema;
export const createAddressSchema = () => addressSchema;
export const createCitySchema = () => citySchema;
export const createPostalCodeSchema = () => postalCodeSchema;
export const createCountrySchema = () => countrySchema;
export const createTaxIdSchema = () => taxIdSchema;
export const createRegistrationNumberSchema = () => registrationNumberSchema;
export const createNotesSchema = () => notesSchema;
export const createIsActiveSchema = () => isActiveSchema;
export const createPolicyNumberSchema = (errorMessage: string) => policyNumberSchema;
export const createClaimStatusSchema = () => claimStatusSchema;
export const createDamageDescriptionSchema = (errorMessage: string) => damageDescriptionSchema;
export const createClaimAmountSchema = (errorMessage: string) => claimAmountSchema;

// Extract schema types
export type NameSchema = z.infer<typeof nameSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type ConfirmPasswordSchema = z.infer<typeof confirmPasswordSchema>;
