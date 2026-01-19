import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

// Helper function to generate unique IDs
const createId = () => nanoid()

// QR Codes table - userId references external auth API
export const qrCodes = sqliteTable('qr_codes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull(), // External user ID from central auth
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

// User Settings table - userId references external auth API
export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().unique(), // External user ID from central auth
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
  userId: text('user_id').notNull(), // External user ID from central auth
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
  shareLinkId: text('share_link_id').notNull(), // Reference to shareLinks.id
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  accessedAt: integer('accessed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Type exports for TypeScript
export type QrCode = typeof qrCodes.$inferSelect
export type NewQrCode = typeof qrCodes.$inferInsert

export type UserSettings = typeof userSettings.$inferSelect
export type NewUserSettings = typeof userSettings.$inferInsert

export type ShareLink = typeof shareLinks.$inferSelect
export type NewShareLink = typeof shareLinks.$inferInsert

export type ShareLinkLog = typeof shareLinkLogs.$inferSelect
export type NewShareLinkLog = typeof shareLinkLogs.$inferInsert
