import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  registrationPhrase: z.string().min(1, 'Registration phrase is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Access Request Schema
export const accessRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  reason: z.string().optional(),
})

// QR Code Schema
export const qrCodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
})

// User Settings Schema
export const userSettingsSchema = z.object({
  displayStyle: z.enum(['carousel', 'grid', 'single']),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  customCss: z.string().optional(),
  showAccountDetails: z.boolean(),
  pageTitle: z.string().optional(),
  pageDescription: z.string().optional(),
})

// Share Link Schema
export const shareLinkSchema = z.object({
  linkType: z.enum(['expiring', 'one-time']),
  expiresIn: z.number().min(1).optional(), // hours
})

// Admin - Generate Registration Phrase Schema
export const generatePhraseSchema = z.object({
  expiresIn: z.number().min(1).optional(), // hours
})

// Admin - Review Access Request Schema
export const reviewAccessRequestSchema = z.object({
  status: z.enum(['approved', 'rejected']),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AccessRequestInput = z.infer<typeof accessRequestSchema>
export type QrCodeInput = z.infer<typeof qrCodeSchema>
export type UserSettingsInput = z.infer<typeof userSettingsSchema>
export type ShareLinkInput = z.infer<typeof shareLinkSchema>
export type GeneratePhraseInput = z.infer<typeof generatePhraseSchema>
export type ReviewAccessRequestInput = z.infer<typeof reviewAccessRequestSchema>
