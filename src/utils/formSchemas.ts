
import { z } from "zod";

// Common field schemas
export const nameSchema = (errorMessage = "Name is required") => 
  z.string().min(1, { message: errorMessage });

export const emailSchema = (errorMessage = "Invalid email address") => 
  z.string().email({ message: errorMessage }).optional().or(z.literal(""));

export const phoneSchema = () => 
  z.string().optional().or(z.literal(""));

export const taxIdSchema = () => 
  z.string().optional().or(z.literal(""));

export const registrationNumberSchema = () => 
  z.string().optional().or(z.literal(""));

export const addressSchema = () => 
  z.string().optional().or(z.literal(""));

export const citySchema = () => 
  z.string().optional().or(z.literal(""));

export const postalCodeSchema = () => 
  z.string().optional().or(z.literal(""));

export const countrySchema = () => 
  z.string().optional().or(z.literal(""));

export const isActiveSchema = () => 
  z.boolean().default(true);

export const notesSchema = () => 
  z.string().optional().or(z.literal(""));

export const currencySchema = () => 
  z.enum(["EUR", "USD", "GBP", "RSD", "MKD"]).default("EUR");

export const dateSchema = (errorMessage = "Date is required") => 
  z.date({ required_error: errorMessage });

export const premiumSchema = (errorMessage = "Premium must be a positive number") => 
  z.coerce.number().positive({ message: errorMessage });

export const percentageSchema = (errorMessage = "Percentage must be between 0 and 100") => 
  z.coerce.number().min(0, { message: "Percentage cannot be negative" })
    .max(100, { message: "Percentage cannot exceed 100" });

// Helper to create schemas for related models
export function createModelSchema(type: string, options: { isRequired?: boolean, errorMessage?: string } = {}) {
  const { isRequired = false, errorMessage = `${type} is required` } = options;
  
  return isRequired 
    ? z.string().min(1, { message: errorMessage })
    : z.string().optional();
}

// Function to create a schema with translations
export function createSchemaWithTranslations(baseSchema: z.ZodType<any>) {
  return baseSchema.extend({
    translations: z.record(z.string()).optional().nullable(),
  });
}
