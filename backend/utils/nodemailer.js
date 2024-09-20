const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
   
  },
});


exports.sendEmail = async (to, subject, textContent, htmlContent) => {
  const mailOptions = {
    from: `"Expense Tracker" <${process.env.SENDER_EMAIL}>`,
    to, 
    subject,
    text: textContent, 
    html: htmlContent, 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
