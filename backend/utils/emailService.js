import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    console.log('🚀 Starting email send process...');
    console.log('   To:', email);
    console.log('   API Key exists:', !!process.env.ELASTIC_EMAIL_API_KEY);
    
    const clientUrl = process.env.CLIENT_URL;
    const verificationUrl = `${clientUrl}/verify-email/${verificationToken}`;

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
                <h2>Verify Your Email</h2>
                <p>Click here to verify: <a href="${verificationUrl}">${verificationUrl}</a></p>
                <p><small>Link expires in 24 hours</small></p>
              `
            }
          ],
          From: 'ship1on2sarkar@gmail.com',
          Subject: 'Verify Your Email - User Management'
        }
      })
    });

    console.log('📡 API Response status:', response.status);
    
    const result = await response.json();
    console.log('📦 API Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Transaction ID:', result.MessageID);
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