'use server'

import { requestToolAccess } from '@/lib/auth/api-client'
import { accessRequestSchema, type AccessRequestInput } from '@/lib/utils/validators'

export async function submitAccessRequest(data: AccessRequestInput) {
  try {
    // Validate input
    const validatedFields = accessRequestSchema.safeParse(data)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid input data' }
    }

    const { name, email, reason } = validatedFields.data

    // Submit request to central auth API
    const result = await requestToolAccess({
      name,
      email: email.toLowerCase(),
      reason,
    })

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to submit request' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting access request:', error)
    return { success: false, error: 'An error occurred while submitting your request' }
  }
}
