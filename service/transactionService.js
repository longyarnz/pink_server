/**
 * @fileoverview Methods for querying data from the transactions collection.
 * @exports { createTransaction, getATransactionWhere, getUserTransactions, deleteTransactionById }
 */
import paystack from 'paystack';
import TransactionModel from '../models/transaction';
import { activateUserAccount } from './userService';
import sendMailToWorker from './mailService';

export const createTransaction = async (amount, user, hookup, purpose) => {
  try {
    const transaction = await TransactionModel.create({ amount, user, hookup, purpose });
    return await TransactionModel.findOne({ _id: transaction._id}).populate('user', 'email');
  }
  catch (err) {
    throw err;
  }
};

export const verifyTransaction = async ({ reference, id }, type) => {
  const PaystackAPI = paystack('sk_test_9b5628c00074df50ca6aa875e5d3c32db208a439');

  try {
    const transaction = await PaystackAPI.transaction.verify(reference);
    const isSuccessful = transaction.message === 'Verification successful';
    if (isSuccessful){
      const updatedTransaction = await setTransactionSuccess(reference);
      const sideEffect = type === 'account' ? await activateUserAccount(id) : sendMailToWorker(id);
      return updatedTransaction && sideEffect;
    }

    else return false;
  }
  catch (err) {
    throw err;
  }
};

export const getATransactionWhere = async (query) => {
  try {
    const transaction = await TransactionModel.findOne(query);
    return transaction;
  }
  catch (err) {
    throw err;
  }
};

export const getUserTransactions = async (user) => {
  try {
    const transactions = await TransactionModel.find({ user });
    return transactions;
  }
  catch (err) {
    throw err;
  }
};


export const setTransactionSuccess = async (id) => {
  try {
    const transaction = await TransactionModel.findOneAndUpdate({
      $or: [
        { _id: id }, { hookup: id }
      ]}, { success: true }, { new: true });
    return transaction && transaction.success;
  }
  catch (err) {
    throw err;
  }
};

export const deleteTransactionById = async (user, transactionId) => {
  try {
    const remove = await TransactionModel.deleteOne({ _id: transactionId, user });
    return remove && remove.ok === 1 ? 'Transaction Deleted' : 'Transaction/User is incorrect';
  }
  catch (err) {
    throw err;
  }
};