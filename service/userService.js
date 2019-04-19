/**
 * @fileoverview Methods for querying data from the users collection.
 * @exports { createUser, authenticateUser, checkIfUserExists, getUserEmail }
 */
import bcrypt from 'bcrypt';
import UserModel from '../models/user';

const HASH = parseInt(process.env.HASH);

/**
 * @description Authenticates a user given an email and a password
 * @param {object} credentials - email and password object
 * @return {object} isValid and id
 */
export const authenticateUser = async (credentials) => {
  try {
    let { email, password } = credentials;
    const user = await UserModel.findOne({ email }).select('password');
    if(user !== null && user.password) {
      const status = await bcrypt.compareSync(password, user.password);
      return status ? { isValid: true, id: user._id } : { isValid: false, id: null };
    }
    else{
      return { isValid: false, id: null };
    }
  }
  catch (err) {
    throw err;
  }
};

/**
 * @description Creates a user given a email and a password
 * @param {object} credentials - email and password object
 * @return {object} isValid and id
 */
export const createUser = async (credentials) => {
  try {
    let { email, password, username, phone, worker, location, rank, image } = credentials;
    const status = await checkIfUserExists({ email });
    if(status) throw('User Already Exists');
    password = await bcrypt.hashSync(password, HASH);
    const user = await UserModel.create({ email, password, username, phone, worker, location, rank, images: [ image ] });
    return typeof user === 'object' ? { isCreated: true, id: user._id } : { isCreated: false, id: null };
  }
  catch (err) {
    throw err;
  }
};

export const checkIfUserExists = async (query) => {
  try{
    const user = await UserModel.findOne(query);
    return user === null ? false : true;
  }
  catch (err) {
    throw err;
  }
};

export const getAllUsersWhere = async (query) => {
  try {
    const user = await UserModel.find(...query);
    return user;
  }
  catch (err) {
    throw err;
  }
};

export const getAUserWhere = async (query) => {
  try {
    const user = await UserModel.findOne(query);
    return user;
  }
  catch (err) {
    throw err;
  }
};

export const getUserEmail =  async (userId) => {
  try{
    const { email } = await UserModel.findOne({_id: userId}).select('email');
    return email;
  }
  catch (err) {
    throw err;
  }
};

export const updateUserProfile = async (userId, profile) => {
  try {
    const user = await UserModel.findOneAndUpdate({ _id: userId }, {
      $set: {
        username: profile.username,
        location: profile.location,
        phone: profile.phone,
      },
      $push: {
        images: {
          $each: [...profile.image, ...profile.more],
          $position: profile.image.length > 0 ? 0 : 999
        }
      }
    }, { new: true });
    return user;
  }
  catch (err) {
    throw err;
  }
};

export const activateUserAccount = async (userId) => {
  try {
    const user = await UserModel.findOneAndUpdate({ _id: userId }, {
      $set: { isActivated: true }
    }, { new: true });
    return user.isActivated;
  }
  catch (err) {
    throw err;
  }
};

export const deleteUserImage = async (userId, image) => {
  try {
    const profile = await UserModel.findOneAndUpdate({ _id: userId }, {
      $pull: {
        images: image
      }
    }, { new: true });
    return !profile.images.some(i => i === image);
  }
  catch (err) {
    throw err;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const remove = await UserModel.deleteOne({ _id: userId });
    return remove.ok === 1;
  }
  catch (err) {
    throw err;
  }
};