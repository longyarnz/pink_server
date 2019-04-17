import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pinkettung@gmail.com',
    pass: process.env.MAIL_PASS
  }
});

export default function sendMail(subject, text, from, to = 'pinkettung@gmail.com') {
  const mailOptions = {
    to,
    from,
    text,
    subject
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${JSON.stringify(info)}`);
    }
  });
}