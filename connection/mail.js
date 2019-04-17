import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.googlemail.com',
  port: 465,
  auth: {
    user: 'pinkettung@gmail.com',
    pass: 'koseunti'
  }
});

export default async function sendMail(subject, text, from, to = 'pinkettung@gmail.com') {
  const mailOptions = { to, from, text, subject };

  return new Promise(resolve => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${JSON.stringify(info)}`);
        resolve(true);
      }
    });
  });
}