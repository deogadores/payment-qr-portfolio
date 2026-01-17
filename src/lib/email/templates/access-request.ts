export const accessRequestEmailTemplate = ({
  name,
  email,
  reason,
}: {
  name: string
  email: string
  reason?: string
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Access Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">New Access Request</h1>
  </div>

  <div style="background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
    <p style="font-size: 16px; color: #2d3748; margin-bottom: 20px;">
      You have received a new access request for the QR Payment Portfolio platform.
    </p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
      <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px;">Requester Details</h2>

      <p style="margin: 10px 0;">
        <strong>Name:</strong> ${name}
      </p>

      <p style="margin: 10px 0;">
        <strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
      </p>

      ${
        reason
          ? `
      <p style="margin: 10px 0;">
        <strong>Reason:</strong>
      </p>
      <p style="margin: 10px 0; padding: 15px; background: #f7fafc; border-radius: 6px; font-style: italic;">
        "${reason}"
      </p>
      `
          : ''
      }
    </div>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/access-requests"
         style="display: inline-block; background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Review Request
      </a>
    </div>

    <p style="font-size: 14px; color: #718096; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      This is an automated notification from QR Payment Portfolio. To approve or reject this request, please log in to your admin dashboard.
    </p>
  </div>
</body>
</html>
`
