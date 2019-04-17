/**
 * @fileoverview Hookup Routes and API endpoints.
 * @exports router
 */
import express from 'express';
import tokenParser from '../middleware/tokenParser';
import activator from '../middleware/activator';
import logger from '../middleware/logger';
import {
  createHookup, getAllUserHookups, getAUserHookup, setHookupAsComplete
} from '../service/hookupService';
const router = express.Router();

/**
 * @description Gets all user hookups
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/', tokenParser, activator, async (req, res) => {
  try {
    const { userId } = req;
    const hookup = await getAllUserHookups({
      $or: [
        { worker: userId }, { client: userId }
      ]
    });
    res.status(200).json(hookup);
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json({message: 'NetworkError: Unable to get user hookups'});
  }
});

/**
 * @description Gets a user hookup
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/:hookupId', tokenParser, activator, async (req, res) => {
  try {
    const { params: { hookupId }, userId } = req;
    const hookup = await getAUserHookup(userId, hookupId);
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
router.post('/', tokenParser, async (req, res) => {
  try {
    const { body: { worker }, userId: client } = req;
    const alpha = 'JKHIHGFKUEIUFISHDFSHKDKPOWPCMZAXQYWIOZLBKDKSGKFBSDKFKJDFVKABNKJNNSOOJPAOISHDOSA';
    const random = i => Math.ceil(Math.random() * i);
    const randomKey = `${alpha.charAt(random(78))}${alpha.charAt(random(78))}-${random(999999)}`;

    const hookup = await createHookup(worker, client, randomKey);
    const { _id: id } = hookup;

    res.status(200).json({ id, randomKey });
  }

  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to Hookup');
  }
});

/**
 * @description Updates the state of a hookup
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.put('/:hookupId', tokenParser, activator, async (req, res) => {
  try {
    const { params: { hookupId }, userId: user } = req;
    const hookup = await setHookupAsComplete(user, hookupId);
    res.status(200).json({ completed: hookup });
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json({ message: 'NetworkError: Unable to complete hookup' });
  }
});

/**
 * @description Deletes a single user hookup
 * @param {middleware} tokenParser - Extracts userId from token
 */
router.delete('/:hookupId', tokenParser, activator, async (req, res) => {
  try {
    // const { params: { hookupId } } = req;
    // const removed = await deleteHookupById(hookupId);
    res.status(200).json('Service not available');
  }
  catch (err) {
    logger.error(err); 
    res.status(400).json('NetworkError: Unable to delete user hookup');
  }
});

export default router;