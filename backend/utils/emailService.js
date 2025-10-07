import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Zoho Mail SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER, // Your Zoho email
    pass: process.env.EMAIL_PASS  // Your 12-character Zoho app password
  },
  connectionTimeout: 30000,
  socketTimeout: 30000,
  tls: {
    rejectUnauthorized: false
  }
});

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    console.log('🚀 Sending PRODUCTION email via Zoho...');
    console.log('   From:', process.env.EMAIL_USER);
    console.log('   To:', email);
    
    const backendUrl = 'https://user-management-backend-71i5.onrender.com';
    const verificationUrl = `${backendUrl}/api/verify-email/${verificationToken}`;

    const mailOptions = {
      from: {
        name: 'User Management System',
        address: process.env.EMAIL_FROM
      },
      to: email,
      subject: 'Verify Your Email Address - User Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background: linear-gradient(135deg, #007bff, #0056b3); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0;">User Management System</h1>
          </div>
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; text-align: center;">Email Verification Required</h2>
            <p>Hello,</p>
            <p>Thank you for registering with our User Management System. Please verify your email address to activate your account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">
              Or copy and paste this link in your browser:<br>
              <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 12px;">
                <strong>Note:</strong> This verification link will expire in 24 hours.
              </p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
            <p style="margin: 0;">If you didn't create an account, please ignore this email.</p>
            <p style="margin: 5px 0 0 0;">© 2024 User Management System. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Verify connection first
    await transporter.verify();
    console.log('✅ Zoho SMTP connection verified');
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ PRODUCTION email sent via Zoho to:', email);
    console.log('📧 Message ID:', info.messageId);
    console.log('🎯 Email should arrive in Gmail inbox, not Mailtrap!');
    return true;
    
  } catch (error) {
    console.error('❌ Zoho email failed:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    return false;
  }
};