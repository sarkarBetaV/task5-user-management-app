import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Mailtrap SMTP Configuration - UPDATE WITH YOUR CREDENTIALS
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '508389bdbade91', // ← Replace with your Mailtrap username
    pass: '39d85980564958'  // ← Replace with your Mailtrap password
  }
});

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    console.log('🚀 Starting email send process via Mailtrap...');
    console.log('   To:', email);
    
    // Use BACKEND URL for verification
    const backendUrl = 'https://user-management-backend-71i5.onrender.com';
    const verificationUrl = `${backendUrl}/api/verify-email/${verificationToken}`;

    const mailOptions = {
      from: '"User Management System" <noreply@usermanagement.com>',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p>Thank you for registering! Please click the button below to verify your email address:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 12px;">
              <strong>Note:</strong> This verification link will expire in 24 hours.
            </p>
          </div>
        </div>
      `
    };

    console.log('📧 Sending email via Mailtrap to:', email);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to Mailtrap inbox');
    console.log('🔗 Verification URL:', verificationUrl);
    console.log('📋 Check emails at: https://mailtrap.io/inboxes');
    return true;
    
  } catch (error) {
    console.error('❌ Mailtrap error:', error.message);
    console.log('🔗 Verification URL (for manual testing):', verificationUrl);
    return true; // Don't block registration
  }
};