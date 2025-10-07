import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    console.log('🚀 Starting email send process...');
    console.log('   To:', email);
    console.log('   API Key exists:', !!process.env.ELASTIC_EMAIL_API_KEY);
    
    // ✅ FIX: Use BACKEND URL for verification, not frontend
    const backendUrl = 'https://user-management-backend-71i5.onrender.com';
    const verificationUrl = `${backendUrl}/api/verify-email/${verificationToken}`;

    // Elastic Email API v4
    const response = await fetch('https://api.elasticemail.com/v4/emails/transactional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ElasticEmail-ApiKey': process.env.ELASTIC_EMAIL_API_KEY
      },
      body: JSON.stringify({
        Recipients: {
          To: [email]
        },
        Content: {
          Body: [
            {
              ContentType: 'HTML',
              Charset: 'utf-8',
              Content: `
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
            }
          ],
          From: 'ship1on2sarkar@gmail.com',
          Subject: 'Verify Your Email Address - User Management System'
        }
      })
    });

    console.log('📡 API Response status:', response.status);
    
    const result = await response.json();
    console.log('📦 API Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Transaction ID:', result.MessageID);
      console.log('🔗 Verification URL:', verificationUrl); // Log the correct URL
      return true;
    } else {
      console.error('❌ API Error:', result);
      return false;
    }

  } catch (error) {
    console.error('💥 Email sending failed completely:', error.message);
    return false;
  }
};