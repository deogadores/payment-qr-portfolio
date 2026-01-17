import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.')
}

export const resend = new Resend(process.env.RESEND_API_KEY || '')

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email not sent (no API key):', { to, subject })
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}
