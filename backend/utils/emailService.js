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
          email: 'ship1on2sarkar@gmail.com' // Use your VERIFIED Gmail
        },
        to: [
          {
            email: email,
            name: email.split('@')[0]
          }
        ],
        subject: 'Verify Your Email Address - User Management System',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p>Thank you for registering! Please click the link below to verify your email address:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #007bff; background: #f8f9fa; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffeaa7;">
              <p style="margin: 0; color: #856404;">
                <strong>Note:</strong> This verification link will expire in 24 hours.
              </p>
            </div>
          </div>
        `
      })
    });

    console.log('📡 Brevo API response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email sent successfully via Brevo');
      console.log('📧 Message ID:', result.messageId);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Brevo API error:', errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ Brevo failed:', error.message);
    return false;
  }
};