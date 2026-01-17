# Payment QR Portfolio

A modern, secure multi-tenant web application for managing and sharing payment QR codes with customizable presentations.

## Features

### Authentication and Access Control

- Email and password authentication with secure JWT-based sessions
- Invitation-only registration using admin-generated phrases
- Role-based access control with admin and user permissions
- Protected routes with middleware-based authentication

### QR Code Management

- Upload and organize multiple payment QR codes
- Add labels and metadata to each QR code
- Cloud storage with Vercel Blob

### Customizable Presentation

- Multiple display modes: Carousel, Grid, and Single Card views
- Custom branding with colors, logos, and CSS
- User-specific display preferences

### Secure Sharing

- Generate shareable links with optional expiration
- One-time use links for added security
- Access analytics and logging

### Admin Dashboard

- Generate and manage registration phrases
- Review and approve access requests
- User management and oversight

### Email Notifications

- Automated notifications for access requests
- Admin alerts for new registrations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite (local) / Turso (production)
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js v5
- **UI**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Email**: Resend
- **Storage**: Vercel Blob
- **Deployment**: Vercel

## License

MIT
