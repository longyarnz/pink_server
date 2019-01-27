/**
 * @fileoverview Server configuration and API endpoints.
 * @exports app
 */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Auth from './api/auth';
import Mail from './api/mail';
import Hookup from './api/hookup';
import Transaction from './api/transaction';

/**
 * @constant {number} PORT
 */
const PORT = process.env.PORT;

/**
 * @constant {number} HOST
 */
const HOST = process.env.HOST;

const PROTOCOL = process.env.HOST === '0.0.0.0' ? 'https' : 'http';

/**
 * @description Creates an express application
 * @constant {object}
 */
const app = express();

/**
 * @description Add middleware for parsing request body to text, json, url object or form data
 * @function EXPRESS_USE_MIDDLEWARE
 * @param {middleware} body-parser A middleware for parsing request body to functional data type
 */
app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * @description Create server Routes
 */
app.use('/auth', Auth);
app.use('/mail', Mail);
app.use('/hookup', Hookup);
app.use('/transaction', Transaction);

/**
 * @description Test server connection
 */
app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const response = JSON.stringify({
    status: 200,
    message: 'Pink et Tu server is online',
  });
  res.send(response);
});

/**
 * @description Let express application listen on dedicated PORT
 */
// eslint-disable-next-line
app.listen(PORT, HOST, () => console.log(`Server listening on ${PROTOCOL}://${HOST}:${PORT}`));

export default app;