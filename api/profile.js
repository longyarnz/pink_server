/**
 * @fileoverview Profile Routes and API endpoints.
 * @exports router
 */
import express from 'express';
import tokenParser from '../middleware/tokenParser';
import logger from '../middleware/logger';
import activator from '../middleware/activator';
import {
  getAUserWhere, updateUserProfile, getAllUsersWhere, deleteUserImage
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
    const { _id, worker, images, email, username, location, rank } = await getAUserWhere({ _id: userId });
    res.status(200).json({ id: _id, worker, images, email, username, location, rank });
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
router.get('/pinks', async (req, res) => {
  try {
    const users = await getAllUsersWhere([{ worker: true, isActivated: true }, 'username images rank']);
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
    const users = await getAllUsersWhere([{ worker: true, _id, isActivated: true }, 'username images rank']);
    res.status(200).json(users);
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
    const { worker, images, username, location } = await updateUserProfile(userId, profile);
    res.status(200).json({ worker, images, username, location });
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