/**
 * @fileoverview Mail Routes and API endpoints.
 * @exports router
 */
import express from 'express';
import logger from '../middleware/logger';
import tokenParser from '../middleware/tokenParser';
import validateMailInput from '../middleware/validateMailInput';
import {
  createMail, getMails, deleteMailById, getAMailWhere
} from '../service/mailService';
const router = express.Router();

/**
 * @description Gets all user mails
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/', tokenParser, async (req, res) => {
  try {
    const mail = await getMails();
    res.status(200).json(mail);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to get mails');
  }
});

/**
 * @description Gets a mail
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/:mailId', tokenParser, async (req, res) => {
  try {
    const { params: { mailId } } = req;
    const mail = await getAMailWhere({ _id: mailId });
    res.status(200).json(mail);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to get user mail');
  }
});

/**
 * @description Creates a single mail
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A newly created mail object
 */
router.post('/', validateMailInput, async (req, res) => {
  try {
    const { body: { email, name, text } } = req;
    const mail = await createMail(name, email, text);
    res.status(200).json(mail);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to create a user mail');
  }
});

/**
 * @description Gets a single mail
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A mail object
 */
router.get('/:mailId', tokenParser, async (req, res) => {
  try {
    const { params: { mailId } } = req;
    const mail = await getAMailWhere({ _id: mailId });
    res.status(200).json(mail);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to get user mail');
  }
});

/**
 * @description Deletes a single mail
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A mail object
 */
router.delete('/:mailId', tokenParser, async (req, res) => {
  try {
    const { params: { mailId }, userId: user } = req;
    const removed = await deleteMailById(user, mailId);
    res.status(200).json(removed);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to delete mail');
  }
});

export default router;