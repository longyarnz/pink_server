/**
 * @fileoverview Methods for querying data from the mails collection.
 * @exports { createMail, getAMailWhere, getUserMails, deleteMailById }
 */
import MailModel from '../models/mail';
import sendMail from '../connection/mail';
import { getAUserWhere } from './userService';
import { getAUserHookup } from './hookupService';

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

export const sendMailToWorker = async (reference, id, userId) => {
  try {
    const { username, email } = await getAUserWhere({ _id: id });
    const { phone, email: clientMail, username: client } = await getAUserWhere({ _id: userId });
    const { randomKey } = await getAUserHookup(userId, reference);
    const text = `
Hi ${username}.

A client has requested for you. Login in to your account at https://test.pinkettu.com.ng to view your verification code.

Any client whose code does not match your code is not valid and authentic.

Your code is: ${randomKey}

The client's phone number is: ${phone}

The client's email is: ${clientMail}

You should contact the client within the hour to finalize arrangements.

For more information, log in and go to your transactions page.

Have fun!
    `.trim();
    await MailModel.create({ name: username, email, text });
    const subject = 'You Have a New Client';
    const clientSubject = 'We Are Preparing Your Pink';
    const clientText = `
Hi ${client}.

Your contact details have been forwarded to your pink.

Your authentication code is: ${randomKey}

Your pink will have a copy of this code. If the code matches, your hookup is authenticated.

Your pink will contact you shortly to finalize arrangements.

For more information, log in and go to your transactions page.

Thank you for using our service.
    `;
    const feedback = await sendMail(subject, text, 'Pinkettung@gmail.com', email)
      && await sendMail(clientSubject, clientText, 'Pinkettung@gmail.com', clientMail);
    
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