import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.pinkettu.com.ng',
  port: 587,
  secure: false,
  auth: {
    user: 'support@pinkettu.com.ng',
    pass: process.env.MAIL_PASS
  }
});

export default function sendMail(name, email, text) {
  const mailOptions = {
    from: email,
    to: 'support@pinkettu.com.ng',
    subject: `${name} Contacted You!`,
    text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${JSON.stringify(info)}`);
    }
  });
}