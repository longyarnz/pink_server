/**
 * @fileoverview Methods for querying data from the hookups collection.
 * @exports { createHookup, getAHookupWhere, getAUserHookup, setHookupAsComplete, deleteHookupById }
 */
import HookupModel from '../models/hookup';

export const createHookup = async (worker, client, randomKey, workerKey, clientKey) => {
  try {
    const hookup = await HookupModel.create({ worker, client, randomKey, workerKey, clientKey });
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
    const hookup = await HookupModel.find(...query)
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

export const setHookupAsComplete = async (userId, hookupId, code) => {
  try {
    let { client, worker, clientKey, workerKey, clientHasVerified, workerHasVerified } = await HookupModel.findOne({ _id: hookupId });
    if (client === userId) clientHasVerified = code === workerKey;
    else if (worker === userId) workerHasVerified = code === clientKey;
    const hookup = await HookupModel.findOneAndUpdate({ _id: hookupId }, { clientHasVerified, workerHasVerified }, { new: true });
    return (client === userId && [hookup.clientHasVerified, hookup.workerHasVerified])
      || (worker === userId && [hookup.workerHasVerified, hookup.clientHasVerified]);
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