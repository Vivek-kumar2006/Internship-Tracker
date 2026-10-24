import nodemailer from 'nodemailer';

// Configure your mail server connection
// (For local testing, you can use a service like Mailtrap, or a real service like Resend/SendGrid)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Sends a real email to the specified recipient
 */
export async function sendEmail(
  to: string, 
  eventType: 'DEADLINE_REMINDER', 
  data: { title: string; deadline: string }
): Promise<void> {
  
  // 1. Customize your subject line based on the event type
  const subject = `⚠️ Reminder: Upcoming Deadline for ${data.title}`;

  // 2. Design the HTML visual layout of the email
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Deadline Approaching!</h2>
      <p>This is an automated alert regarding your tracked opportunity.</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p><strong>Opportunity:</strong> ${data.title}</p>
      <p><strong>Due Date:</strong> ${new Date(data.deadline).toLocaleDateString()}</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #777;">You are receiving this because you requested a 5-day warning alert.</p>
    </div>
  `;

  // 3. Dispatch the message across the web
  await transporter.sendMail({
    from: '"App Notifications" <alerts@yourdomain.com>',
    to: to,
    subject: subject,
    html: htmlContent,
  });
}
