/**
 * @fileoverview Methods for querying data from the mails collection.
 * @exports { createMail, getAMailWhere, getUserMails, deleteMailById }
 */
import MailModel from '../models/mail';
import sendMail from '../connection/mail';
import { getAUserWhere } from './userService';
import { getAHookupWhere } from './hookupService';

export const createMail = async (name, email, text) => {
  try {
    const mail = await MailModel.create({ name, email, text });
    const subject = `${name} Contacted You!`;
    sendMail(subject, text, email);
    return mail;
  }
  catch (err) {
    throw err;
  }
};

export const sendMailToWorker = async (reference, id) => {
  try {
    const { client: { _id: userId }, randomKey } = await getAHookupWhere({ _id: reference }, 'client randomKey');
    const { username, email } = await getAUserWhere({ _id: id });
    const { phone, email: clientMail, username: client } = await getAUserWhere({ _id: userId });
    const text = `
      <b>Hi ${username}</b>
      <br /> <br />
      A client has requested for you. Login in to your account at <b>https://test.pinkettu.com.ng/hookups.html</b> to view your verification code.
      <br />
      Any client whose code does not match your code is not valid and authentic.
      <br /> <br />
      Your code is: <h1><code>${randomKey}</code></h1>

      The client's phone number is: <b><code>${phone}</code></b>
      <br /> <br />
      The client's email is: <b><code>${clientMail}</code></b>
      <br /> <br />
      You should contact the client within the hour to finalize arrangements.
      For more information, log in and access your hookups page.
      <br /> <br />
      Have fun!
    `.trim();
    await MailModel.create({ name: username, email, text });
    const subject = 'You Have a New Client';
    const clientSubject = 'We Are Preparing Your Pink';
    const clientText = `
      <b>Hi ${client}</b>
      <br /> <br />
      Your contact details have been forwarded to your pink.
      Your authentication code is: <h1><code>${randomKey}</code></h1>

      Your pink will have a copy of this code. If the code matches, your hookup is authenticated.
      Your pink will contact you shortly to finalize arrangements.
      <br />
      For more information, log in to your account and open: <b>https://test.pinkettu.com.ng/hookups.html</b>
      <br /> <br />
      Thank you for using our service.
    `;
    const feedback = await sendMail(subject, text, `${'Pink et Tu'} <pinkettung@gmail.com>`, email)
      && await sendMail(clientSubject, clientText, `${'Pink et Tu'} <pinkettung@gmail.com>`, clientMail);
    
    return feedback;
  }
  catch (err) {
    throw err;
  }
};

export const getMails = async () => {
  try {
    const mail = await MailModel.find();
    return mail;
  }
  catch (err) {
    throw err;
  }
};

export const getAMailWhere = async (query) => {
  try {
    const mail = await MailModel.findOne(query);
    return mail;
  }
  catch (err) {
    throw err;
  }
};

export const deleteMailById = async (mailId) => {
  try {
    const remove = await MailModel.deleteOne({ _id: mailId });
    return remove && remove.ok === 1 ? 'Mail Deleted' : 'Mail ID is incorrect';
  }
  catch (err) {
    throw err;
  }
};