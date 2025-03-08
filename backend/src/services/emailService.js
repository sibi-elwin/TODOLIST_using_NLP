const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const { logger } = require('../utils/logger');

// Initialize SendGrid API as backup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create transporter with SendGrid and proper SSL configuration
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  }
});

// Add error event handler
transporter.on('error', (error) => {
  logger.error('SMTP Transport Error:', error);
});

// Verify transporter connection
transporter.verify(function(error, success) {
  if (error) {
    logger.error('SMTP connection error:', error);
    logger.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  } else {
    logger.info('SMTP server is ready to send emails');
  }
});

const sendTaskReminder = async (userEmail, task) => {
  try {
    logger.info(`Attempting to send email to ${userEmail} for task ${task.id}`);
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Task Reminder</h2>
        <p>Hello! This is a reminder for your task due today:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">${task.title}</h3>
          ${task.description ? `<p style="color: #4B5563;">${task.description}</p>` : ''}
          <p style="color: #4B5563;"><strong>Priority:</strong> ${task.priority}</p>
          <p style="color: #4B5563;"><strong>Category:</strong> ${task.category}</p>
          <p style="color: #4B5563;"><strong>Due:</strong> ${new Date(task.dueDate).toLocaleString()}</p>
        </div>
        
        <a href="${process.env.FRONTEND_URL}/" 
           style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Task
        </a>
        
        <p style="color: #6B7280; margin-top: 20px;">
          Stay productive!
        </p>
      </div>
    `;

    try {
      // Try SMTP first
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: userEmail,
        subject: `Task Reminder: ${task.title}`,
        html: emailContent
      };

      logger.info('Attempting to send via SMTP...');
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully via SMTP. Message ID: ${info.messageId}`);
    } catch (smtpError) {
      logger.error('SMTP send failed, trying SendGrid API:', smtpError);
      
      // Fallback to SendGrid API
      const msg = {
        to: userEmail,
        from: process.env.SENDER_EMAIL,
        subject: `Task Reminder: ${task.title}`,
        html: emailContent,
      };

      await sgMail.send(msg);
      logger.info('Email sent successfully via SendGrid API');
    }

    logger.info(`Reminder email sent for task: ${task.id} to user: ${userEmail}`);
  } catch (error) {
    logger.error('Error sending reminder email:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });
    throw error;
  }
};

module.exports = {
  sendTaskReminder
};