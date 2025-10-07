import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    console.log('🚀 Sending email via Brevo to:', email);
    
    const backendUrl = 'https://user-management-backend-71i5.onrender.com';
    const verificationUrl = `${backendUrl}/api/verify-email/${verificationToken}`;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'User Management System',
          email: 'noreply@usermanagement.com'
        },
        to: [
          {
            email: email,
            name: email.split('@')[0]
          }
        ],
        subject: 'Verify Your Email Address',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
            <p>Or copy: ${verificationUrl}</p>
            <p><small>Link expires in 24 hours</small></p>
          </div>
        `
      })
    });

    if (response.ok) {
      console.log('✅ Email sent via Brevo to:', email);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Brevo error:', error);
      return false;
    }

  } catch (error) {
    console.error('❌ Brevo failed:', error.message);
    return false;
  }
};