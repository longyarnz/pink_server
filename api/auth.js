/**
 * @fileoverview Authentication Route for server connection.
 * @exports router
 */
import express from 'express';
import 'babel-polyfill';
import JWT from 'jsonwebtoken';
import UUID from 'uuid';
import { authenticateUser, createUser } from '../service/userService';
import validateInput from '../middleware/validateInput';
import validateLoginInput from '../middleware/validateLoginInput';
import tokenParser from '../middleware/tokenParser';
import logger from '../middleware/logger';

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
    const { email, password, username, worker, image } = req.body;
    const user = await createUser({ email, password, username, worker, image });

    if (user.isCreated) {
      res.redirect(307, '/auth/login');
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
    const user = await authenticateUser({ email, password });

    if (user.isValid) {
      /**
       * @description Creates JWT token from the email and password
       */
      JWT.sign({ id: user.id }, SERVER_KEY, (err, token) => {
        if (err) res.status(400).json('Server is currently unavailable');

        const message = {
          text: 'User log-in successful',
          token
        };

        /**
         * @description Returns user token
         */
        res.status(200).json(message);
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

  catch (err) {
    logger.error(err); res.status(400).json(err.message);
  }
});

/**
 * @description Log a user out of the Server
 * @param {string} route An API route to login
 * @returns {Response} JSON
 */
router.get('/logout', tokenParser, (req, res) => {
  SERVER_KEY = UUID.v4();
  res.header['authorization'] = '';
  res.status(200).json({ message: 'User logged out' });
});

export { SERVER_KEY };

export default router;