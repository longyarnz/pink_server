import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pinkettung@gmail.com',
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