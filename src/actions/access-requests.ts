'use server'

import { db } from '@/lib/db'
import { accessRequests, users } from '@/lib/db/schema'
import { accessRequestSchema, type AccessRequestInput } from '@/lib/utils/validators'
import { sendEmail } from '@/lib/email/resend'
import { accessRequestEmailTemplate } from '@/lib/email/templates/access-request'
import { eq, or } from 'drizzle-orm'

export async function submitAccessRequest(data: AccessRequestInput) {
  try {
    // Validate input
    const validatedFields = accessRequestSchema.safeParse(data)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid input data' }
    }

    const { name, email, reason } = validatedFields.data
    const normalizedEmail = email.toLowerCase()

    // Check if user already has an account
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)
    const existingUser = existingUsers[0]

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.'
      }
    }

    // Check if there's already a pending or approved request with this email
    const existingRequests = await db
      .select()
      .from(accessRequests)
      .where(eq(accessRequests.email, normalizedEmail))
      .limit(1)
    const existingRequest = existingRequests[0]

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return {
          success: false,
          error: 'You have already submitted an access request. Please wait for it to be reviewed.'
        }
      }
      if (existingRequest.status === 'approved') {
        return {
          success: false,
          error: 'Your access request has already been approved. Please check your email for the registration phrase.'
        }
      }
      // If status is 'rejected', allow them to submit a new request
      // Delete the old rejected request first
      await db
        .delete(accessRequests)
        .where(eq(accessRequests.id, existingRequest.id))
    }

    // Save to database
    await db.insert(accessRequests).values({
      name,
      email: normalizedEmail,
      reason,
      status: 'pending',
    })

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: 'New Access Request - QR Payment Portfolio',
        html: accessRequestEmailTemplate({ name, email, reason }),
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting access request:', error)
    return { success: false, error: 'An error occurred while submitting your request' }
  }
}
