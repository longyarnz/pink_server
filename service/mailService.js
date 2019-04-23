/**
 * @fileoverview Methods for querying data from the mails collection.
 * @exports { createMail, getAMailWhere, getUserMails, deleteMailById }
 */
import MailModel from '../models/mail';
import sendMail from '../connection/mail';
import { getAUserWhere } from './userService';
import { getAHookupWhere } from './hookupService';

export const createMail = async (name, email, purpose, text) => {
  try {
    const mail = await MailModel.create({ name, email, text, purpose });
    const from = `${mail.name} <${mail.email}>`;
    await sendMail(`${mail.purpose} From <${mail.email}>`, mail.text, from);
    return mail;
  }
  catch (err) {
    throw err;
  }
};

export const sendMailToWorker = async (reference, id) => {
  try {
    const { client: { _id: userId }, randomKey, clientKey, workerKey } = await getAHookupWhere({ _id: reference });
    const { username, email } = await getAUserWhere([{ _id: id }]);
    const { phone, email: clientMail, username: client } = await getAUserWhere([{ _id: userId }]);
    const text = `
      <b>Hi ${username}</b>
      <br /> <br />
      A client has requested for you.
      Any client whose hookup-code does not match your code is not valid and authentic.
      <br /> <br />

      Your <b>Hook-Up Code</b> is: <h1><code>${randomKey}</code></h1>

      Your <b>Secret Code</b> is: <h1><code>${workerKey}</code></h1>

      The client's phone number is: <h1><code>${phone}</code></h1>

      The client's email is: <h1><code>${clientMail}</code></h1>

      Share your secret code with your client for verification.
      You should contact the client within the hour to finalize arrangements.
      For more information, log in and access your hookups page.
      <br /> <br />

      Have fun!
    `.trim();
    await MailModel.create({ name: username, email, text, purpose: 'Pink Notification' });
    const subject = 'You Have a New Client';
    const clientSubject = 'Hook-Up Activation';
    const clientText = `
      <b>Hi ${client}</b>
      <br /> <br />
      Your contact details have been forwarded to your pink.
      <br /> <br />
      Your <b>Hook-Up Code</b> is: <h1><code>${randomKey}</code></h1>

      Your <b>Secret Code</b> is: <h1><code>${clientKey}</code></h1>

      Share your secret code with your pink for verification. For more info log in to your <a href="https://test.pinkettu.com.ng/hookups.html"><b>account</b></a>.
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