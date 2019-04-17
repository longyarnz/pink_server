/**
 * @fileoverview Methods for querying data from the hookups collection.
 * @exports { createHookup, getAHookupWhere, getAUserHookup, setHookupAsComplete, deleteHookupById }
 */
import HookupModel from '../models/hookup';

export const createHookup = async (worker, client, randomKey) => {
  try {
    const hookup = await HookupModel.create({ worker, client, randomKey });
    return hookup;
  }
  catch (err) {
    throw err;
  }
};

export const getAHookupWhere = async (query) => {
  try {
    const hookup = await HookupModel.findOne(query)
      .populate('worker', 'username')
      .populate('client', 'username');
    return hookup;
  }
  catch (err) {
    throw err;
  }
};

export const getAllUserHookups = async (query) => {
  try {
    const hookup = await HookupModel.find(query)
      .populate('worker', 'username')
      .populate('client', 'username');
    return hookup;
  }
  catch (err) {
    throw err;
  }
};

export const getAUserHookup = async (userId, hookupId) => {
  try {
    const hookups = await HookupModel.find({
      $or: [
        { worker: userId }, { client: userId }
      ]
    });
    const hookup = hookups.find(({ _id }) => _id.toString() === hookupId);
    return hookup !== undefined ? hookup : { message: 'Hookup not found' };
  }
  catch (err) {
    throw err;
  }
};

export const setHookupAsComplete = async (user, hookupId) => {
  try {
    const hookup = await HookupModel.findOneAndUpdate({ _id: hookupId, client: user }, { completed: true }, { new: true });
    return hookup.completed ? 'Hookup is completed' : 'Unable to complete hookup';
  }
  catch (err) {
    throw err;
  }
};

export const deleteHookupById = async (hookupId) => {
  try {
    const remove = await HookupModel.deleteOne({ _id: hookupId });
    return remove.ok === 1;
  }
  catch (err) {
    throw err;
  }
};