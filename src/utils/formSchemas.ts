
import { z } from "zod";

// Basic schemas 
export const nameSchema = (errorMessage = "Name is required") => z.string().min(1, errorMessage);
export const emailSchema = (errorMessage = "Invalid email format") => z.string().email(errorMessage);
export const passwordSchema = (errorMessage = "Password must be at least 8 characters") => z.string().min(8, errorMessage);
export const confirmPasswordSchema = (password: string, errorMessage = "Passwords don't match") => 
  z.string().refine((value) => value === password, {
    message: errorMessage
  });

export const phoneSchema = () => z.string().optional();
export const addressSchema = () => z.string().optional();
export const citySchema = () => z.string().optional();
export const postalCodeSchema = () => z.string().optional();
export const countrySchema = () => z.string().optional();
export const taxIdSchema = () => z.string().optional();
export const registrationNumberSchema = () => z.string().optional();
export const notesSchema = () => z.string().optional();
export const isActiveSchema = () => z.boolean().default(true);
export const currencySchema = (errorMessage = "Currency is required") => z.string().min(1, errorMessage);
export const dateSchema = () => z.string().optional();
export const premiumSchema = (errorMessage = "Premium must be a positive number") => z.number().nonnegative(errorMessage);
export const percentageSchema = (errorMessage = "Percentage must be between 0 and 100") => z.number().min(0).max(100, errorMessage);
export const policyNumberSchema = (errorMessage = "Policy number is required") => z.string().min(1, errorMessage);

export const claimStatusSchema = () => z.enum([
  "in_processing", 
  "reported", 
  "accepted", 
  "rejected", 
  "partially_accepted", 
  "appealed", 
  "withdrawn"
]);

export const damageDescriptionSchema = (errorMessage = "Damage description is required") => z.string().min(1, errorMessage);
export const claimAmountSchema = (errorMessage = "Claim amount must be a positive number") => z.number().positive(errorMessage);

// Factory function for creating model schemas that allows proper type checking
export const createModelSchema = (type: string, options: { isRequired?: boolean; errorMessage?: string } = {}) => {
  const baseSchema = z.string();
  if (options.isRequired) {
    return baseSchema.min(1, options.errorMessage || `${type} is required`);
  }
  return baseSchema.optional();
};

// Extract schema types
export type NameSchema = z.infer<ReturnType<typeof nameSchema>>;
export type EmailSchema = z.infer<ReturnType<typeof emailSchema>>;
export type PasswordSchema = z.infer<ReturnType<typeof passwordSchema>>;
export type ConfirmPasswordSchema = z.infer<ReturnType<typeof confirmPasswordSchema>>;
export type PhoneSchema = z.infer<ReturnType<typeof phoneSchema>>;
export type AddressSchema = z.infer<ReturnType<typeof addressSchema>>;
export type CitySchema = z.infer<ReturnType<typeof citySchema>>;
export type PostalCodeSchema = z.infer<ReturnType<typeof postalCodeSchema>>;
export type CountrySchema = z.infer<ReturnType<typeof countrySchema>>;
export type TaxIdSchema = z.infer<ReturnType<typeof taxIdSchema>>;
export type RegistrationNumberSchema = z.infer<ReturnType<typeof registrationNumberSchema>>;
export type NotesSchema = z.infer<ReturnType<typeof notesSchema>>;
export type IsActiveSchema = z.infer<ReturnType<typeof isActiveSchema>>;
export type CurrencySchema = z.infer<ReturnType<typeof currencySchema>>;
export type DateSchema = z.infer<ReturnType<typeof dateSchema>>;
export type PremiumSchema = z.infer<ReturnType<typeof premiumSchema>>;
export type PercentageSchema = z.infer<ReturnType<typeof percentageSchema>>;
export type PolicyNumberSchema = z.infer<ReturnType<typeof policyNumberSchema>>;
export type ClaimStatusSchema = z.infer<ReturnType<typeof claimStatusSchema>>;
export type DamageDescriptionSchema = z.infer<ReturnType<typeof damageDescriptionSchema>>;
export type ClaimAmountSchema = z.infer<ReturnType<typeof claimAmountSchema>>;
