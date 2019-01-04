/**
 * @fileoverview Hookup Routes and API endpoints.
 * @exports router
 */
import express from 'express';
import tokenParser from '../middleware/tokenParser';
import logger from '../middleware/logger';
import {
  createHookup, getAHookupWhere, setHookupAsComplete, deleteHookupById
} from '../service/hookupService';
const router = express.Router();

/**
 * @description Gets all user hookups
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/', tokenParser, async (req, res) => {
  try {
    const { userId } = req;
    const hookup = await getAHookupWhere({
      $or: [
        { worker: userId }, { client: userId }
      ]
    });
    res.status(200).json(hookup);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to get user hookups');
  }
});

/**
 * @description Gets a user hookup
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/:hookupId', tokenParser, async (req, res) => {
  try {
    const { params: { hookupId } } = req;
    const hookup = await getAHookupWhere({ _id: hookupId });
    res.status(200).json(hookup);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to get user hookups');
  }
});

/**
 * @description Creates a single hookup
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A newly created hookup object
 */
router.post('/:workerId/:clientId/:randomKey', tokenParser, async (req, res) => {
  try {
    const { params: { workerId, clientId, randomKey } } = req;
    const hookup = await createHookup(workerId, clientId, randomKey);
    res.status(200).json(hookup);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to create a user hookup');
  }
});

/**
 * @description Updates the state of a hookup
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A boolean
 */
router.put('/:hookupId', tokenParser, async (req, res) => {
  try {
    const { params: { hookupId } } = req;
    const hookup = await setHookupAsComplete(hookupId);
    res.status(200).json(hookup);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to complete hookup');
  }
});

/**
 * @description Deletes a single user hookup
 * @param {middleware} tokenParser - Extracts userId from token
 */
router.delete('/:hookupId', tokenParser, async (req, res) => {
  try {
    const { params: { hookupId } } = req;
    const removed = await deleteHookupById(hookupId);
    res.status(200).json(removed);
  }
  catch (err) {
    logger.error(err); res.status(400).json('NetworkError: Unable to delete user hookup');
  }
});

export default router;