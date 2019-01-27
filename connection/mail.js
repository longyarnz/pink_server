import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'twentyfour.qservers.net',
  port: 587,
  secure: false,
  auth: {
    user: 'support@pinkettu.com.ng',
    pass: process.env.MAIL_PASS
  }
});

export default function sendMail(name, email, message) {
  const mailOptions = {
    from: email,
    to: 'support@pinkettu.com.ng',
    subject: `${name} Contacted You!`,
    text: message,
    dsn: {
      id: 'some random message specific id',
      return: 'headers',
      notify: ['failure', 'delay', 'success'],
      recipient: 'support@pinkettu.com.ng'
    }
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${JSON.stringify(info)}`);
    }
  });
}