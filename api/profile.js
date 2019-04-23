/**
 * @fileoverview Profile Routes and API endpoints.
 * @exports router
 */
import express from 'express';
import tokenParser from '../middleware/tokenParser';
import logger from '../middleware/logger';
import activator from '../middleware/activator';
import {
  getAUserWhere, updateUserProfile, getAllUsersWhere, deleteUserImage, verifyUserProfile
} from '../service/userService';
const router = express.Router();

/**
 * @description Gets a user profile
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/', tokenParser, activator, async (req, res) => {
  try {
    const { userId } = req;
    const user = await getAUserWhere([{ _id: userId }, 'username phone images rank rates worker location email emailIsVerified']);
    user.id = user._id;
    res.status(200).json(user);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to get user profile');
  }
});

/**
 * @description Get Pink Profiles
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/pinks', async (req, res) => {
  try {
    const users = await getAllUsersWhere([{ worker: true, isActivated: true }, 'username phone images rank rates location email emailIsVerified']);
    res.status(200).json(users);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to get user profile');
  }
});

/**
 * @description Get Pink Profiles
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/pinks/limit/:limit', async (req, res) => {
  try {
    let { params: {limit} } = req;
    limit = parseInt(limit);
    const users = await getAllUsersWhere([{ worker: true, isActivated: true }, 'username phone images rank rates location email emailIsVerified', { limit }]);
    res.status(200).json(users);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to get user profile');
  }
});

/**
 * @description Gets a user profile
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/pinks/:id', async (req, res) => {
  const { params: { id: _id } } = req;
  try {
    const user = await getAUserWhere([{ worker: true, _id, isActivated: true }, 'username phone images rank rates worker location email emailIsVerified']);
    res.status(200).json(user);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to get user profile');
  }
});

/**
 * @description Gets a user profile
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/:id/verify', async (req, res) => {
  const { params: { id: userId } } = req;
  try {
    const user = await verifyUserProfile(userId);
    if (user) res.status(200).send(`
      <div style="width: 100%; height: 95vh; display: flex; justify-content: center; align-items: center; font-family: monospace; font-weight: bolder; font-size: 200%">
        USER ACCOUNT VERIFIED
      </div>
    `);
    else res.status(200).json('Something went wrong, user account is not verified');
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to verify user');
  }
});

/**
 * @description Gets a user profile
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.get('/clients/:id', async (req, res) => {
  const { params: { id: _id } } = req;
  try {
    const user = await getAUserWhere([{ worker: false, _id }, 'username images worker location email emailIsVerified']);
    res.status(200).json(user);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to get user profile');
  }
});

/**
 * @description Updates the profile of a user
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
router.put('/', tokenParser, activator, async (req, res) => {
  try {
    const { body: profile, userId } = req;
    const { worker, images, username, rates, location, phone, emailIsVerified } = await updateUserProfile(userId, profile);
    res.status(200).json({ worker, images, username, rates, location, phone, emailIsVerified });
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to update user profile');
  }
});

/**
 * @description Deletes a single Image from User profile
 * @param {middleware} tokenParser - Extracts userId from token
 */
router.delete('/image/:image', tokenParser, activator, async (req, res) => {
  try {
    const { params: { image }, userId } = req;
    const removed = await deleteUserImage(userId, image);
    res.status(200).json(removed);
  }
  catch (err) {
    logger.error(err);
    res.status(400).json({ message: 'NetworkError: Unable to delete image' });
  }
});

/**
 * @description Deletes a single user
 * @param {middleware} tokenParser - Extracts userId from token
 */
router.delete('/', tokenParser, activator, async (req, res) => {
  try {
    // const { userId } = req;
    // const removed = await deleteUserById(userId);
    res.status(200).json('Service not available');
  }
  catch (err) {
    logger.error(err);
    res.status(400).json('NetworkError: Unable to delete user');
  }
});

export default router;