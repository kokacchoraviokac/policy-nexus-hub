
import { z } from "zod";

// Base schemas
export const nameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters")
});

export const emailSchema = z.object({
  email: z.string().email("Invalid email format")
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

export const confirmPasswordSchema = z.object({
  confirmPassword: z.string()
});

// Form schemas
export const registerFormSchema = z
  .object({
    ...nameSchema.shape,
    ...emailSchema.shape,
    ...passwordSchema.shape,
    ...confirmPasswordSchema.shape
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const loginFormSchema = z.object({
  ...emailSchema.shape,
  ...passwordSchema.shape,
  rememberMe: z.boolean().optional()
});

export const forgotPasswordFormSchema = z.object({
  ...emailSchema.shape
});

export const resetPasswordFormSchema = z
  .object({
    ...passwordSchema.shape,
    ...confirmPasswordSchema.shape
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const updateProfileFormSchema = z.object({
  ...nameSchema.shape,
  ...emailSchema.shape,
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional()
});

export const updatePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    ...passwordSchema.shape,
    ...confirmPasswordSchema.shape
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const basicUserFormSchema = z.object({
  ...nameSchema.shape,
  ...emailSchema.shape
});

// Create a new schema without ZodType.extend which doesn't exist in some Zod versions
export const userFormSchema = z.object({
  ...nameSchema.shape,
  ...emailSchema.shape,
  role: z.enum(["admin", "user", "manager"]),
  status: z.enum(["active", "inactive", "pending"]).optional()
});

export const createUserFormSchema = z
  .object({
    ...userFormSchema.shape,
    ...passwordSchema.shape,
    ...confirmPasswordSchema.shape
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const organizationFormSchema = z.object({
  ...nameSchema.shape,
  industry: z.string().min(2, "Industry must be at least 2 characters").optional(),
  size: z.enum(["small", "medium", "large", "enterprise"]).optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional()
});
