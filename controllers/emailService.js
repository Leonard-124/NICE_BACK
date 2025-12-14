// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@yourdomain.com";


// export const sendVerificationEmail = async (email, username, verificationToken)  => {
//     const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

//     const msg = {
//         to: email,
//         from: FROM_EMAIL,
//         subject: "Verify Your Email - Unix Platform",
//         html:  `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
//                      padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//             .button { display: inline-block; padding: 15px 30px; background: #667eea; 
//                      color: white; text-decoration: none; border-radius: 5px; 
//                      font-weight: bold; margin: 20px 0; }
//             .button:hover { background: #5568d3; }
//             .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
//             .warning { background: #fff3cd; border-left: 4px solid #ffc107; 
//                       padding: 15px; margin: 20px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>🎨 Welcome to Unix!</h1>
//             </div>
//             <div class="content">
//               <h2>Hello ${username}! 👋</h2>
//               <p>Thank you for registering with Unix - your creative marketplace platform.</p>
//               <p>To complete your registration and start posting your amazing artworks and inventions, 
//                  please verify your email address by clicking the button below:</p>
              
//               <div style="text-align: center;">
//                 <a href="${verificationUrl}" class="button">Verify Email Address</a>
//               </div>
              
//               <p>Or copy and paste this link into your browser:</p>
//               <p style="word-break: break-all; color: #667eea; font-size: 12px;">
//                 ${verificationUrl}
//               </p>
              
//               <div class="warning">
//                 <strong>⏰ Important:</strong> This verification link will expire in 24 hours.
//               </div>
              
//               <p>If you didn't create an account with Unix, please ignore this email.</p>
//             </div>
//             <div class="footer">
//               <p>© ${new Date().getFullYear()} Unix Platform. All rights reserved.</p>
//               <p>This is an automated email, please do not reply.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `,
//     text: `
//     Welcome to Unix, ${username}!
    
//     To verify your email, visit: ${verificationUrl}
    
//     This link expires in 24 hours.
    
//     If you didn't create this account, please ignore this email.
//     `,
//     };
//     try {
//         await sgMail.send(msg);
//         console.log(`Verification email sent to ${email}`);
//         return {success: true};
//     } catch (error) {
//         console.error("Email send error", error);
//         throw new Error("Failed to send verification email");
        
//     }
// };


// export const sendPasswordResetEmail = async (email, username, resetToken) => {
//     const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

//     const msg = {
//         to: email,
//         from: FROM_EMAIL,
//         subject: "Password Reset Request - Unix Platform",
//         html: `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #dc3545; padding: 30px; text-align: center; 
//                      color: white; border-radius: 10px 10px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//             .button { display: inline-block; padding: 15px 30px; background: #dc3545; 
//                      color: white; text-decoration: none; border-radius: 5px; 
//                      font-weight: bold; margin: 20px 0; }
//             .warning { background: #f8d7da; border-left: 4px solid #dc3545; 
//                       padding: 15px; margin: 20px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>🔒 Password Reset Request</h1>
//             </div>
//             <div class="content">
//               <h2>Hello ${username},</h2>
//               <p>We received a request to reset your password for your Unix account.</p>
//               <p>Click the button below to reset your password:</p>
              
//               <div style="text-align: center;">
//                 <a href="${resetUrl}" class="button">Reset Password</a>
//               </div>
              
//               <p>Or copy this link: ${resetUrl}</p>
              
//               <div class="warning">
//                 <strong>⚠️ Security Notice:</strong>
//                 <ul>
//                   <li>This link expires in 1 hour</li>
//                   <li>If you didn't request this, please ignore this email</li>
//                   <li>Your password won't change unless you click the link above</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </body>
//       </html>
//     `,
//     };
//     try {
//         await sgMail.send(msg);
//         console.log(`Password reset email sent to ${email}`);
//         return {success: true};
//     } catch (error) {
//         console.error("Email send error:", error);
//         throw new Error("Failed to send password reset email");
        
//     }
// };


// export const sendWelcomeEmail = async (email, username, role)  => {
//     const msg = {
//         to: email,
//         from: FROM_EMAIL,
//         subject: "Welcome to IbonnI - Get Started!",
//         html: `
//       <!DOCTYPE html>
//       <html>
//         <body style="font-family: Arial, sans-serif;">
//           <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//             <h1 style="color: #667eea;">Welcome to Unix, ${username}! 🎨</h1>
//             <p>Your email has been verified successfully!</p>
            
//             <div style="background: #f0f7ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
//               <h3>🚀 Get Started:</h3>
//               <ul>
//                 <li><strong>Post Your Work:</strong> Share your artworks and inventions</li>
//                 <li><strong>Connect:</strong> Message other creators</li>
//                 <li><strong>Sell:</strong> Start earning from your creations</li>
//                 ${role === 'admin' ? '<li><strong>Admin Access:</strong> Manage the platform</li>' : ''}
//                 ${role === 'manager' ? '<li><strong>Manager Access:</strong> Moderate content</li>' : ''}
//               </ul>
//             </div>
            
//             <a href="${FRONTEND_URL}/profile" 
//                style="display: inline-block; padding: 15px 30px; background: #667eea; 
//                       color: white; text-decoration: none; border-radius: 5px; 
//                       font-weight: bold;">
//               Go to Your Profile
//             </a>
            
//             <p style="margin-top: 30px; color: #777;">
//               Need help? Visit our <a href="${FRONTEND_URL}/help">Help Center</a>
//             </p>
//           </div>
//         </body>
//       </html>
//     `,
//     };

//     try {
//         await sgMail.send(msg);
//         console.log(`Welcome email sent to ${email}`);
//     } catch (error) {
//         console.error("Welcome email error:", error);
//     }
// };

// export const sendLoginNotification = async (email, username, loginDetails) => {
//     const msg = {
//         to: email,
//         from: FROM_EMAIL,
//         subject: "New Login to Your IbonnI Account",
//         html: `
//       <!DOCTYPE html>
//       <html>
//         <body style="font-family: Arial, sans-serif;">
//           <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//             <h2>🔐 New Login Detected</h2>
//             <p>Hello ${username},</p>
//             <p>We detected a new login to your Unix account:</p>
            
//             <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
//               <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
//               <p><strong>IP Address:</strong> ${loginDetails.ip || 'Unknown'}</p>
//               <p><strong>Device:</strong> ${loginDetails.userAgent || 'Unknown'}</p>
//             </div>
            
//             <p>If this was you, you can ignore this email.</p>
//             <p>If you didn't log in, please secure your account immediately:</p>
//             <a href="${FRONTEND_URL}/reset-password" 
//                style="display: inline-block; padding: 10px 20px; background: #dc3545; 
//                       color: white; text-decoration: none; border-radius: 5px;">
//               Reset Password
//             </a>
//           </div>
//         </body>
//       </html>
//     `,
//     };
//     try {
//         await sgMail.send(msg);
//     } catch (error) {
//         console.error("Login notification error", error)
//     }
// }


// services/emailService.js
import SibApiV3Sdk from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

// Configure Brevo API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const FROM_EMAIL = process.env.FROM_EMAIL || "loluoch710@gmail.com";
const FROM_NAME = process.env.FROM_NAME || "IbonnI";

/**
 * Send email verification
 */
export const sendVerificationEmail = async (recipientEmail, username, verificationToken) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email: recipientEmail, name: username }];
  sendSmtpEmail.subject = "Verify Your Email - Unix Platform";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                   padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; 
                   color: white; text-decoration: none; border-radius: 5px; 
                   font-weight: bold; margin: 20px 0; }
          .button:hover { background: #5568d3; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; 
                    padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎨 Welcome to Unix!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}! 👋</h2>
            <p>Thank you for registering with Unix - your creative marketplace platform.</p>
            <p>To complete your registration and start posting your amazing artworks and inventions, 
               please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 12px;">
              ${verificationUrl}
            </p>
            
            <div class="warning">
              <strong>⏰ Important:</strong> This verification link will expire in 24 hours.
            </div>
            
            <p>If you didn't create an account with Unix, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Unix Platform. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  sendSmtpEmail.textContent = `
    Welcome to Unix, ${username}!
    
    To verify your email, visit: ${verificationUrl}
    
    This link expires in 24 hours.
    
    If you didn't create this account, please ignore this email.
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Verification email sent to ${recipientEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Brevo email send error:", error);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (recipientEmail, username, resetToken) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email: recipientEmail, name: username }];
  sendSmtpEmail.subject = "Password Reset Request - Unix Platform";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; padding: 30px; text-align: center; 
                   color: white; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #dc3545; 
                   color: white; text-decoration: none; border-radius: 5px; 
                   font-weight: bold; margin: 20px 0; }
          .warning { background: #f8d7da; border-left: 4px solid #dc3545; 
                    padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${username},</h2>
            <p>We received a request to reset your password for your Unix account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy this link: ${resetUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link expires in 1 hour</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password won't change unless you click the link above</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Password reset email sent to ${recipientEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Brevo email send error:", error);
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Send welcome email after verification
 */
export const sendWelcomeEmail = async (recipientEmail, username, role) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email: recipientEmail, name: username }];
  sendSmtpEmail.subject = "Welcome to Unix - Get Started! 🎉";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #667eea;">Welcome to IbonnI, ${username}! 🎨</h1>
          <p>Your email has been verified successfully!</p>
          
          <div style="background: #f0f7ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>🚀 Get Started:</h3>
            <ul>
              <li><strong>Post Your Work:</strong> Share your artworks and inventions</li>
              <li><strong>Connect:</strong> Message other creators</li>
              <li><strong>Sell:</strong> Start earning from your creations</li>
              ${role === 'admin' ? '<li><strong>Admin Access:</strong> Manage the platform</li>' : ''}
              ${role === 'manager' ? '<li><strong>Manager Access:</strong> Moderate content</li>' : ''}
            </ul>
          </div>
          
          <a href="${FRONTEND_URL}/profile" 
             style="display: inline-block; padding: 15px 30px; background: #667eea; 
                    color: white; text-decoration: none; border-radius: 5px; 
                    font-weight: bold;">
            Go to Your Profile
          </a>
          
          <p style="margin-top: 30px; color: #777;">
            Need help? Visit our <a href="${FRONTEND_URL}/help">Help Center</a>
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Welcome email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("❌ Brevo welcome email error:", error);
  }
};

/**
 * Send login notification for new device/location
 */
export const sendLoginNotification = async (recipientEmail, username, loginDetails) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email: recipientEmail, name: username }];
  sendSmtpEmail.subject = "New Login to Your Unix Account";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>🔐 New Login Detected</h2>
          <p>Hello ${username},</p>
          <p>We detected a new login to your Unix account:</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>IP Address:</strong> ${loginDetails.ip || 'Unknown'}</p>
            <p><strong>Device:</strong> ${loginDetails.userAgent || 'Unknown'}</p>
          </div>
          
          <p>If this was you, you can ignore this email.</p>
          <p>If you didn't log in, please secure your account immediately:</p>
          <a href="${FRONTEND_URL}/reset-password" 
             style="display: inline-block; padding: 10px 20px; background: #dc3545; 
                    color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </div>
      </body>
    </html>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("❌ Brevo login notification error:", error);
  }
};