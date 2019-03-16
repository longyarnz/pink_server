/**
 * @fileoverview activator is a middleware that checks the activation status of the user. 
 * @exports activator
 */
import { checkIfUserExists } from '../service/userService';

export default async (req, res, next) => {
  const userHasActivated = await checkIfUserExists({
    $or: [
      { _id: req.userId, isActivated: true, worker: true }, 
      { _id: req.userId, worker: false }
    ]
  });
  if (userHasActivated) {
    next();
  }
  else {
    res.status(400).json({
      id: req.userId,
      message: 'User has not activated the account'
    });
  }
};