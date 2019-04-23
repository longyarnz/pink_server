/**
 * @fileoverview Authentication Route for server connection.
 * @exports router
 */
import express from 'express';
import 'babel-polyfill';
import JWT from 'jsonwebtoken';
import UUID from 'uuid';
import { authenticateUser, createUser, checkIfUserExists, getAUserWhere } from '../service/userService';
import validateInput from '../middleware/validateInput';
import validateLoginInput from '../middleware/validateLoginInput';
import tokenParser from '../middleware/tokenParser';
import logger from '../middleware/logger';
import sendMail from '../connection/mail';

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
        You got this email but you did not register at Pinkettu? please ignore it.
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

      else if (!userHasActivated) {
        res.status(400).json({
          id: user.id,
          email: email,
          message: 'User has not activated the account'
        });
      }

      else {
        const message = {
          text: 'Email and password does not match',
          token: false
        };

        res.status(200).json(message);
      }
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