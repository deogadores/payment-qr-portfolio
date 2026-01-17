interface AccessApprovedEmailProps {
  name: string
  registrationPhrase: string
  expiresAt?: Date | null
  appUrl: string
}

export function accessApprovedEmailTemplate({
  name,
  registrationPhrase,
  expiresAt,
  appUrl,
}: AccessApprovedEmailProps): string {
  const expiryText = expiresAt
    ? `<p style="color: #ef4444; font-size: 14px; margin: 0;">This phrase expires on: <strong>${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString()}</strong></p>`
    : ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Access Request Approved</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Access Approved</h1>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Great news! Your access request for <strong>QR Payment Portfolio</strong> has been approved.
        </p>

        <p style="font-size: 16px; margin-bottom: 10px;">
          Use the registration phrase below to create your account:
        </p>

        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #6366f1; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="font-size: 12px; color: #6366f1; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Registration Phrase</p>
          <p style="font-size: 24px; font-weight: bold; color: #1e293b; margin: 0; font-family: 'Courier New', monospace; letter-spacing: 2px;">${registrationPhrase}</p>
          ${expiryText}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${appUrl}/register?phrase=${encodeURIComponent(registrationPhrase)}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Create Your Account
          </a>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>Important:</strong> This registration phrase can only be used once. Keep it secure and don't share it with anyone.
          </p>
        </div>

        <h3 style="font-size: 16px; margin-top: 30px; color: #374151;">How to Register:</h3>
        <ol style="font-size: 14px; color: #6b7280; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Click the "Create Your Account" button above (the registration phrase will be pre-filled)</li>
          <li style="margin-bottom: 8px;">Fill in your name, email, and create a password</li>
          <li style="margin-bottom: 8px;">Start managing your payment QR codes</li>
        </ol>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="font-size: 14px; color: #9ca3af; margin: 0;">
          If you didn't request access to QR Payment Portfolio, you can safely ignore this email.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">${new Date().getFullYear()} QR Payment Portfolio. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}
