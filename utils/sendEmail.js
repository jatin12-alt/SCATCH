// This utility assumes a development SMTP or can be mocked for local testing.
const nodemailer = require('nodemailer');

// Configure this with your SMTP provider for production
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

async function sendEmail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: 'noreply@taskflow.com',
    to,
    subject,
    html
  });
  if (process.env.NODE_ENV === 'development') {
    console.log('Preview URL (dev): %s', nodemailer.getTestMessageUrl(info));
  }
}

module.exports = sendEmail;

