import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

// Helper function to generate unique IDs
const createId = () => nanoid()

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
  registrationPhraseId: text('registration_phrase_id').references(() => registrationPhrases.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

// Registration Phrases table
export const registrationPhrases = sqliteTable('registration_phrases', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  phrase: text('phrase').notNull().unique(),
  isUsed: integer('is_used', { mode: 'boolean' }).notNull().default(false),
  usedBy: text('used_by').references(() => users.id),
  usedAt: integer('used_at', { mode: 'timestamp' }),
  createdBy: text('created_by').notNull(), // Admin email who created it
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
})

// Access Requests table
export const accessRequests = sqliteTable('access_requests', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  reason: text('reason'),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] })
    .notNull()
    .default('pending'),
  reviewedBy: text('reviewed_by'), // Admin email who reviewed
  reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// QR Codes table
export const qrCodes = sqliteTable('qr_codes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(), // Vercel Blob URL
  accountName: text('account_name'), // Bank/payment provider name
  accountNumber: text('account_number'), // Optional account details
  order: integer('order').notNull().default(0), // For custom ordering
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

// User Settings table
export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayStyle: text('display_style', { enum: ['carousel', 'grid', 'single'] })
    .notNull()
    .default('carousel'),
  primaryColor: text('primary_color').notNull().default('#3b82f6'),
  secondaryColor: text('secondary_color').notNull().default('#1e40af'),
  backgroundColor: text('background_color').notNull().default('#ffffff'),
  logoUrl: text('logo_url'), // Vercel Blob URL for custom logo
  customCss: text('custom_css'), // User's custom CSS
  showAccountDetails: integer('show_account_details', { mode: 'boolean' })
    .notNull()
    .default(true),
  pageTitle: text('page_title'),
  pageDescription: text('page_description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

// Share Links table
export const shareLinks = sqliteTable('share_links', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(), // URL-safe random token
  linkType: text('link_type', { enum: ['expiring', 'one-time'] }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }), // For expiring links
  isUsed: integer('is_used', { mode: 'boolean' }).notNull().default(false), // For one-time links
  usedAt: integer('used_at', { mode: 'timestamp' }), // When link was used
  accessCount: integer('access_count').notNull().default(0),
  lastAccessedAt: integer('last_accessed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Share Link Access Logs table (optional, for analytics)
export const shareLinkLogs = sqliteTable('share_link_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  shareLinkId: text('share_link_id')
    .notNull()
    .references(() => shareLinks.id, { onDelete: 'cascade' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  accessedAt: integer('accessed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Type exports for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type RegistrationPhrase = typeof registrationPhrases.$inferSelect
export type NewRegistrationPhrase = typeof registrationPhrases.$inferInsert

export type AccessRequest = typeof accessRequests.$inferSelect
export type NewAccessRequest = typeof accessRequests.$inferInsert

export type QrCode = typeof qrCodes.$inferSelect
export type NewQrCode = typeof qrCodes.$inferInsert

export type UserSettings = typeof userSettings.$inferSelect
export type NewUserSettings = typeof userSettings.$inferInsert

export type ShareLink = typeof shareLinks.$inferSelect
export type NewShareLink = typeof shareLinks.$inferInsert

export type ShareLinkLog = typeof shareLinkLogs.$inferSelect
export type NewShareLinkLog = typeof shareLinkLogs.$inferInsert
