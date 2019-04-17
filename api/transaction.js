/**
 * @fileoverview Transaction Routes and API endpoints.
 * @exports router
 */
import express from 'express';
import logger from '../middleware/logger';
import tokenParser from '../middleware/tokenParser';
import validateTransactionInput from '../middleware/validateTransactionInput';
import {
  getUserTransactions, createTransaction, verifyTransaction, deleteTransactionById, setTransactionSuccess, getATransactionWhere
} from '../service/transactionService';
import { checkIfUserExists } from '../service/userService';
const router = express.Router();

/**
 * @description Gets all user transactions
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/', tokenParser, async (req, res) => {
  try {
    const { userId } = req;
    const transaction = await getUserTransactions(userId);
    res.status(200).json(transaction);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to get user transactions');
  }
});

/**
 * @description Gets a user transaction
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/:transactionId', tokenParser, async (req, res) => {
  try {
    const { params: { transactionId }, userId } = req;
    const transactions = await getUserTransactions(userId);
    const query = transactions.find(({ _id }) => _id.toString() === transactionId);
    const transaction = query !== undefined ? query : { message: 'Hookup not found' };
    res.status(200).json(transaction);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to get user transaction');
  }
});

/**
 * @description Creates a single transaction
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A newly created transaction object
 */
router.post('/', validateTransactionInput, tokenParser, async (req, res) => {
  try {
    const { body: { amount, hookup, purpose }, userId: user } = req;
    const { _id: id, user: profile } = await createTransaction(amount, user, hookup, purpose);
    res.status(200).json({ id, user: profile });
  }
  catch (err) {
    logger.error(err);
    res.status(400).json({ message: 'NetworkError: Unable to initiate transaction' });
  }
});

/**
 * @description Creates a single transaction for account activation
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A newly created transaction object
 */
router.post('/activate/:user', async (req, res) => {
  try {
    const { params: { user } } = req;
    const userHasActivated = await checkIfUserExists({
      _id: user, isActivated: true, worker: true
    });

    if (userHasActivated) {
      res.status(200).json({ status: 'Account is already activated' });
    }

    else {
      const amount = 1000, hookup = null, purpose = 'Account Activation';
      const { _id: id, user: profile } = await createTransaction(amount, user, hookup, purpose);
      res.status(200).json({ id, user: profile });
    }
  }
  catch (err) {
    logger.error(err);
    res.status(400).json({ message: 'NetworkError: Unable to create a user transaction' });
  }
});

/**
 * @description Verifies a single user transaction
 * @returns {object} A newly created transaction object
 */
router.post('/verify/:type', async (req, res) => {
  try {
    const { body, params: { type } } = req;
    const transaction = await verifyTransaction(body, type);
    if (transaction) {
      res.status(200).json('Transaction is Verified');
    }

    else {
      res.status(400).json('Transaction is not Verified');
    }

  }
  catch (err) {
    logger.error(err);
    res.status(400).json({ message: 'NetworkError: Unable to verify transaction' });
  }
});

/**
 * @description Updates a single transaction
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A newly created transaction object
 */
router.put('/:transactionId', tokenParser, async (req, res) => {
  try {
    const { params: { transactionId }, userId: user } = req;
    const transaction = await setTransactionSuccess(user, transactionId);
    res.status(200).json(transaction);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to update transaction');
  }
});

/**
 * @description Gets a single transaction
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A transaction object
 */
router.get('/:transactionId', tokenParser, async (req, res) => {
  try {
    const { params: { transactionId } } = req;
    const transaction = await getATransactionWhere({ _id: transactionId });
    res.status(200).json(transaction);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to get user transaction');
  }
});

/**
 * @description Deletes a single transaction
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A transaction object
 */
router.delete('/:transactionId', tokenParser, async (req, res) => {
  try {
    const { params: { transactionId }, userId: user } = req;
    const removed = await deleteTransactionById(user, transactionId);
    res.status(200).json(removed);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to delete user transaction');
  }
});

export default router;