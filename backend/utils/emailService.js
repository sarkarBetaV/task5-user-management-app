import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    console.log('🚀 Sending email via Brevo to:', email);
    
    // ✅ Use FRONTEND URL for verification - users will see beautiful pages
    const frontendUrl = 'https://user-management-frontend-amvt.onrender.com';
    const verificationUrl = `${frontendUrl}/verify-email/${verificationToken}`;

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
          email: 'sarkarshiponb@gmail.com' // Your verified Brevo sender
        },
        to: [
          {
            email: email,
            name: email.split('@')[0]
          }
        ],
        subject: 'Verify Your Email Address - User Management System',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f8f9fa;
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              }
              .header { 
                background: linear-gradient(135deg, #007bff, #0056b3); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
              }
              .header h1 { 
                margin: 0; 
                font-size: 28px;
                font-weight: bold;
              }
              .content { 
                padding: 40px 30px; 
              }
              .button { 
                background: linear-gradient(135deg, #28a745, #20c997); 
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 8px; 
                display: inline-block; 
                font-size: 16px; 
                font-weight: bold;
                margin: 20px 0;
                transition: transform 0.2s, box-shadow 0.2s;
              }
              .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
              }
              .verification-link {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                word-break: break-all;
                margin: 20px 0;
                color: #007bff;
                font-size: 14px;
              }
              .note {
                background: #fff3cd;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #ffeaa7;
                color: #856404;
                font-size: 14px;
                margin: 20px 0;
              }
              .footer { 
                text-align: center; 
                padding: 20px; 
                background: #f1f1f1; 
                font-size: 12px; 
                color: #666; 
              }
              .steps {
                margin: 25px 0;
                padding: 0;
                list-style: none;
              }
              .steps li {
                margin: 10px 0;
                padding-left: 25px;
                position: relative;
              }
              .steps li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #28a745;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>User Management System</h1>
                <p>Secure Account Verification</p>
              </div>
              
              <div class="content">
                <h2 style="color: #333; margin-top: 0;">Almost There! Verify Your Email</h2>
                
                <p>Hello there! 👋</p>
                <p>Thank you for registering with <strong>User Management System</strong>. You're just one step away from accessing your account.</p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">
                    Verify Email Address
                  </a>
                </div>

                <p><strong>What happens next?</strong></p>
                <ul class="steps">
                  <li>Click the verification button above</li>
                  <li>You'll see a beautiful confirmation page</li>
                  <li>Login to your new account</li>
                  <li>Start managing your profile</li>
                </ul>

                <p><strong>Alternative method:</strong> If the button doesn't work, copy and paste this link in your browser:</p>
                <div class="verification-link">
                  ${verificationUrl}
                </div>
                
                <div class="note">
                  <strong>⚠️ Important:</strong> This verification link will expire in <strong>24 hours</strong> for security reasons.
                </div>

                <p>If you didn't create an account with us, please ignore this email.</p>
                
                <p>Welcome aboard!<br>
                <strong>The User Management Team</strong></p>
              </div>
              
              <div class="footer">
                <p>This email was sent by User Management System</p>
                <p>© 2024 User Management System. All rights reserved.</p>
                <p style="font-size: 11px; color: #999; margin-top: 10px;">
                  If you need help, please contact our support team.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    });

    console.log('📡 Brevo API response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email sent successfully via Brevo');
      console.log('📧 Message ID:', result.messageId);
      console.log('🔗 Verification URL:', verificationUrl);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Brevo API error:', errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ Brevo failed:', error.message);
    
    // Log the verification URL for manual sending if email fails
    const frontendUrl = 'https://user-management-frontend-amvt.onrender.com';
    const verificationUrl = `${frontendUrl}/verify-email/${verificationToken}`;
    console.log('🔗 MANUAL VERIFICATION URL:', verificationUrl);
    
    return false;
  }
};