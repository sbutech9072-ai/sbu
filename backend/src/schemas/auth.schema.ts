import { z } from 'zod';

export const clientRegisterSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  country: z.string().trim().min(2, 'Country is required'),
  whatsappNumber: z.string().trim().optional().nullable(),
});

export const clientLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ownerLoginSchema = z.object({
  email: z.string().trim().email('Invalid company email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  country: z.string().trim().min(2).optional(),
  whatsappNumber: z.string().trim().optional().nullable(),
});

export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;
export type ClientLoginInput = z.infer<typeof clientLoginSchema>;
export type OwnerLoginInput = z.infer<typeof ownerLoginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
