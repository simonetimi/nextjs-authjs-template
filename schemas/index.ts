import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const PasswordResetSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(256)
    .refine(
      (value) => /[A-Z]/.test(value),
      'Password must contain at least one uppercase letter',
    )
    .refine(
      (value) => /[a-z]/.test(value),
      'Password must contain at least one lowercase letter',
    )
    .refine(
      (value) => /[0-9]/.test(value),
      'Password must contain at least one number',
    ),
});

export const LoginSchema = z.object({
  email: z.string().email('Email is required'),
  password: z.string().min(1, 'Password is required'),
  code: z.optional(z.string()),
});

export const RequestPasswordResetSchema = z.object({
  email: z.string().email('Email is required'),
});

export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, "Name can't be longer than 50 characters"),
  email: z
    .string()
    .email('Email is required')
    .toLowerCase()
    .trim()
    .min(4)
    .max(254),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(256)
    .refine(
      (value) => /[A-Z]/.test(value),
      'Password must contain at least one uppercase letter',
    )
    .refine(
      (value) => /[a-z]/.test(value),
      'Password must contain at least one lowercase letter',
    )
    .refine(
      (value) => /[0-9]/.test(value),
      'Password must contain at least one number',
    ),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string()),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: 'New password is required', path: ['newPassword'] },
  )
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    { message: 'Current password is required', path: ['password'] },
  );
