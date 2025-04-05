
import { z } from "zod";

// Base schemas
export const nameSchema = (errorMessage = "Name is required") =>
  z.string().min(1, { message: errorMessage }).max(100);

export const emailSchema = (errorMessage = "Invalid email format") =>
  z.string().email({ message: errorMessage });

export const passwordSchema = (errorMessage = "Password must be at least 6 characters") =>
  z.string().min(6, { message: errorMessage });

export const confirmPasswordSchema = (errorMessage = "Passwords must match") =>
  z.string().min(1, { message: errorMessage });

export const phoneSchema = (errorMessage = "Phone number is required") =>
  z.string().min(1, { message: errorMessage });

export const addressSchema = (errorMessage = "Address is required") =>
  z.string().min(1, { message: errorMessage });

export const citySchema = (errorMessage = "City is required") =>
  z.string().min(1, { message: errorMessage });

export const postalCodeSchema = (errorMessage = "Postal code is required") =>
  z.string().min(1, { message: errorMessage });

export const countrySchema = (errorMessage = "Country is required") =>
  z.string().min(1, { message: errorMessage });

export const taxIdSchema = (errorMessage = "Tax ID is required") =>
  z.string().min(1, { message: errorMessage });

export const registrationNumberSchema = (errorMessage = "Registration number is required") =>
  z.string().min(1, { message: errorMessage });

export const notesSchema = () =>
  z.string().optional();

export const isActiveSchema = () =>
  z.boolean().default(true);

export const currencySchema = (errorMessage = "Currency is required") =>
  z.string().min(1, { message: errorMessage });

export const dateSchema = (errorMessage = "Date is required") =>
  z.string().min(1, { message: errorMessage });

export const premiumSchema = (errorMessage = "Premium must be greater than 0") =>
  z.number().min(0.01, { message: errorMessage });

export const percentageSchema = (errorMessage = "Percentage must be between 0 and 100") =>
  z.number().min(0, { message: "Percentage must be at least 0" }).max(100, { message: "Percentage cannot exceed 100" });

export const claimStatusSchema = (errorMessage = "Status is required") =>
  z.enum(["in_processing", "reported", "accepted", "partially_accepted", "rejected", "appealed", "withdrawn"], { 
    errorMap: () => ({ message: errorMessage }) 
  });

export const damageDescriptionSchema = (errorMessage = "Damage description is required") =>
  z.string().min(1, { message: errorMessage });

export const claimAmountSchema = (errorMessage = "Claim amount must be greater than 0") =>
  z.number().min(0.01, { message: errorMessage });

// Helper function to create model-related schema (for foreign keys)
export function createModelSchema(modelName: string, options: { 
  isRequired?: boolean; 
  errorMessage?: string;
}) {
  const schema = z.string().refine(val => !options.isRequired || val.length > 0, {
    message: options.errorMessage || `${modelName} is required`
  });
  
  return schema;
}

// Complex schema creator with generic type support
export function createZodSchema<T extends z.ZodType>(baseSchema: T) {
  return {
    extend: (extendSchema: z.ZodObject<any>) => {
      // This is a simple implementation that merges schemas
      return z.object({
        ...baseSchema.shape,
        ...extendSchema.shape
      });
    }
  };
}
