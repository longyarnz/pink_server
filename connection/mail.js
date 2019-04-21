import nodemailer from 'nodemailer';
import { rejects } from 'assert';
import logger from '../middleware/logger';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'pinkettung@gmail.com',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN
  }
});

export default async function sendMail(subject, text, from, to = 'pinkettung@gmail.com') {
  const mailOptions = {
    to,
    from,
    subject,
    html: text,
    envelope: {
      from: 'Pinkettu <pinkettung@gmail.com>',
      to
    },
    generateTextFromHTML: true
  };

  return new Promise(resolve => {
    try {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          logger.error(error);
          rejects(false);
        } else {
          logger.info(`Email sent: ${JSON.stringify(info)}`);
          resolve(true);
        }
        transporter.close();
      });
    }
    catch (err) {
      logger.error(err);
      throw err;
    }
  });
}