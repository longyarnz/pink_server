/**
 * @fileoverview Authentication Route for server connection.
 * @exports router
 */
import express from 'express';
import 'babel-polyfill';
import JWT from 'jsonwebtoken';
import UUID from 'uuid';
import validateInput from '../middleware/validateInput';
import validateLoginInput from '../middleware/validateLoginInput';
import tokenParser from '../middleware/tokenParser';
import logger from '../middleware/logger';
import sendMail from '../connection/mail';
import ResetModel from '../models/reset';
import { authenticateUser, createUser, checkIfUserExists, getAUserWhere, resetUserPassword } from '../service/userService';

const router = express.Router();

let SERVER_KEY = new Function(`
  'use strict';
  return ${process.env.SERVER_KEY}
`)()(UUID);

/**
 * @description Registers a user into the Server
 * @param {string} route An API route to login
 * @param {middleware} validateInput - Callback for post method to routes
 * @returns {Response} JSON
 */
router.post('/signup', validateInput, async (req, res) => {
  try {
    const { email, password, username, worker, location, image, phone } = req.body;
    const user = await createUser({ email, password, username, worker, location, image, phone });

    if (user.isCreated) {
      const subject = 'Verify Your Pink et Tu Account';
      const text = `
        Hi there.
        <br /> <br />
        We have registered your account at <a href="https://pinkettu.com.ng">pinkettu.com.ng</a>. Click the button below to verify your email address.
        <br /> <br />
        <div style="text-align: center; margin: 20px auto">
          <a style="padding: 10px 20px; background-color: #000; color: #fff; font-weight: bold" href="https://api.pinkettu.com.ng/profile/${user.id}/verify"><code>VERIFY</code></a>
        </div>
        <br /> <br />
        You got this email but you did not register at Pinkettu? Please ignore it.
        <br /> <br />
        Thank You.
      `;
      await sendMail(subject, text, 'Pink et Tu <pinkettung@gmail.com>', email);

      if (!worker) {
        JWT.sign({ id: user.id }, SERVER_KEY, (err, token) => {
          if (err) res.status(400).json('Server is currently unavailable');

          const message = {
            text: 'User log-in successful',
            token, worker
          };

          res.status(200).json(message);
        });
      }

      else {
        res.status(400).json({
          id: user.id,
          email: email,
          message: 'User has not activated the account'
        });
      }
    }

    else {
      res.status(400).json('Error: User Already Exists');
    }
  }
  catch (err) {
    logger.error(err);
    res.status(400).json(err);
  }
});

/**
 * @description Logs a user into the Server
 * @param {string} route An API route to login
 * @param {middleware} validateInput - Callback for post method to routes
 * @returns {Response} JSON
 */
router.post('/login', validateLoginInput, async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await checkIfUserExists({ email });

    if (!user) {
      const message = {
        text: 'You have not registered!',
        token: false
      };

      res.status(200).json(message);
    }

    else {
      user = await authenticateUser({ email, password });
      const userHasActivated = await checkIfUserExists({
        $or: [
          { email, isActivated: true, worker: true },
          { email, worker: false }
        ]
      });

      if (user.isValid && userHasActivated) {
        const { worker } = await getAUserWhere([{ email }]);
        JWT.sign({ id: user.id }, SERVER_KEY, (err, token) => {
          if (err) throw err;

          const message = {
            text: 'User log-in successful',
            token, worker
          };

          res.status(200).json(message);
        });
      }

      else if (!user.isValid) {
        const message = {
          text: 'Email and password do not match.',
          token: false
        };

        res.status(200).json(message);
      }

      else if (!userHasActivated) {
        res.status(400).json({
          id: user.id,
          email: email,
          message: 'User has not activated the account.'
        });
      }

      else res.status(400).json('Network Error');
    }
  }

  catch (err) {
    logger.error(err);
    res.status(400).json(err);
  }
});

/**
 * @description Resets a user's password
 * @param {string} route An API route to login
 * @returns {Response} JSON
 */
router.post('/reset', async (req, res) => {
  const { email } = req.body;

  try {
    let user = await checkIfUserExists({ email });

    if (!user) {
      res.status(400).json('You have not registered!');
    }

    else {
      const resetPassword = await ResetModel.create({ email });
      const subject = 'Reset Your Pink et Tu Account Password';
      const text = `
        Hi there.
        <br /> <br />
        We are resetting your account password. This link is only valid for 1 hour. Click the button below to continue.
        <br /> <br />
        <div style="text-align: center; margin: 20px auto">
          <a 
            style="padding: 10px 20px; background-color: #000; color: #fff; font-weight: bold" 
            href="https://api.pinkettu.com.ng/auth/reset/${resetPassword._id}"
          >
            <code>RESET PASSWORD</code>
          </a>
        </div>
        <br /> <br />
        <span style="color: red; font-weight: bold">You got this email but you did not register at Pinkettu? Please ignore it.</span>
        <br /> <br />
        Thank You.
      `;
      await sendMail(subject, text, 'Pink et Tu <pinkettung@gmail.com>', email);

      res.status(200).json('Reset link has been sent to your email. Link is only valid for 1 hour.');
    }
  }

  catch (err) {
    logger.error(err);
    res.status(400).json('Network Error');
  }
});

/**
 * @description Logs a user into the Server
 * @param {string} route An API route to login
 * @param {middleware} validateInput - Callback for post method to routes
 * @returns {Response} JSON
 */
router.get('/reset/:id', async (req, res) => {
  const { params: { id } } = req;

  try {
    let record = await ResetModel.findOne({ _id: id, isValid: false });
    const failed = (text = '') => {
      res.status(400).send(`
        <div style="width: 100%; height: 95vh; display: flex; justify-content: center; align-items: center; font-family: monospace; font-weight: bolder; font-size: 200%">
        PASSWORD RESET FAILED${text}
        </div>
      `);
    };

    if (!record) failed(': USER DID NOT REQUEST PASSWORD CHANGE');

    else {
      const timeHasElapsed = (Date.now() - Date.parse(record.date_created)) / (1000 * 60 * 60) > 1;
      if (timeHasElapsed) failed(': 1 HOUR TIME FRAMED ELAPSED');

      else {
        record = await ResetModel.findOneAndUpdate({ _id: id }, { isValid: true }, { new: true });
        if (record.isValid) {
          res.status(200).send(`
            <div style="width: 100%; height: 95vh; display: flex; justify-content: center; align-items: center; font-family: monospace; font-weight: bolder; font-size: 200%; flex-direction: column">
              <span>YOUR PASSWORD HAS BEEN RESET.</span>
              <br /> <br />
              <a 
                style="padding: 10px 20px; background-color: #000; color: #fff; font-weight: bold" 
                href="https://pinkettu.com.ng/new.html?user=${id}"
              >
                <code>CREATE NEW PASSWORD</code>
              </a>
            </div>
          `);
        }
        else failed();
      }
    }
  }

  catch (err) {
    logger.error(err);
    res.status(400).json(err);
  }
});

/**
 * @description Logs a user into the Server
 * @param {string} route An API route to login
 * @param {middleware} validateInput - Callback for post method to routes
 * @returns {Response} JSON
 */
router.post('/reset/:id', async (req, res) => {
  const { params: { id }, body: { password } } = req;

  try {
    let record = await ResetModel.findOne({ _id: id, isValid: true, complete: false });
    const failed = text => {
      logger.error(text || 'The user did not initiate password reset');
      res.status(400).json('Password Reset Failed');
    };

    if (!record) failed();

    else {
      const updateStatus = await resetUserPassword(record.email, password);
      record = updateStatus && await ResetModel.findOneAndUpdate({ _id: id }, { complete: true }, { new: true });
      if (updateStatus && record.complete) res.status(200).json('Password has been reset');
      else failed('Password update failed');
    }
  }

  catch (err) {
    logger.error(err);
    res.status(400).json(err);
  }
});

/**
 * @description Log a user out of the Server
 * @param {string} route An API route to login
 * @returns {Response} JSON
 */
router.get('/logout', tokenParser, (req, res) => {
  res.header['authorization'] = '';
  res.json({ message: 'User is logged out' });
});

export { SERVER_KEY };

export default router;