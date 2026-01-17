interface AccessRejectedEmailProps {
  name: string
  appUrl: string
}

export function accessRejectedEmailTemplate({
  name,
  appUrl,
}: AccessRejectedEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Access Request Update</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #6b7280; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Access Request Update</h1>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Thank you for your interest in <strong>QR Payment Portfolio</strong>.
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          After reviewing your request, we're unable to approve access at this time. This could be due to various reasons, and we appreciate your understanding.
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          If you believe this decision was made in error or if your circumstances have changed, you're welcome to submit a new access request with additional details.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${appUrl}/#request-access" style="display: inline-block; background: #6b7280; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Submit New Request
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="font-size: 14px; color: #9ca3af; margin: 0;">
          If you have any questions, please contact our support team.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} QR Payment Portfolio. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}
