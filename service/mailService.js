/**
 * @fileoverview Methods for querying data from the mails collection.
 * @exports { createMail, getAMailWhere, getUserMails, deleteMailById }
 */
import MailModel from '../models/mail';
import sendMail from '../connection/mail';
import { getAUserWhere } from './userService';

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

export const sendMailToWorker = async id => {
  try {
    const { username, email } = await getAUserWhere({ _id: id });
    const text = `
Hi ${username}.

A client has requested for you. Login in to your account at https://test.pinkettu.com.ng to view your code.

Go to your transactions page to check for your client code.

Have fun!
    `.trim();
    await MailModel.create({ name: username, email, text });
    const subject = 'You Have a New Client';
    const feedback = await sendMail(subject, text, 'support@pinkettu.com.ng', 'lekanmedia@gmail.com');
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