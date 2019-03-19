/**
 * @fileoverview Methods for querying data from the transactions collection.
 * @exports { createTransaction, getATransactionWhere, getUserTransactions, deleteTransactionById }
 */
import paystack from 'paystack';
import TransactionModel from '../models/transaction';
import { activateUserAccount } from './userService';

const createTransaction = async (amount, user, hookup, purpose) => {
  try {
    const transaction = await TransactionModel.create({ amount, user, hookup, purpose });
    return await TransactionModel.findOne({ _id: transaction._id}).populate('user', 'email');
  }
  catch (err) {
    throw err;
  }
};

const verifyTransaction = async ({ reference, id }) => {
  const PaystackAPI = paystack('sk_test_9b5628c00074df50ca6aa875e5d3c32db208a439');

  try {
    const transaction = await PaystackAPI.transaction.verify(reference);
    const isSuccessful = transaction.message === 'Verification successful';

    if(isSuccessful){
      const updatedTransaction = await setTransactionSuccess(reference);
      const activatedUser = await activateUserAccount(id);
      return updatedTransaction && activatedUser;
    }

    else return false;
  }
  catch (err) {
    throw err;
  }
};

const getATransactionWhere = async (query) => {
  try {
    const transaction = await TransactionModel.findOne(query);
    return transaction;
  }
  catch (err) {
    throw err;
  }
};

const getUserTransactions = async (user) => {
  try {
    const transactions = await TransactionModel.find({ user });
    return transactions;
  }
  catch (err) {
    throw err;
  }
};


const setTransactionSuccess = async (transactionId) => {
  try {
    const transaction = await TransactionModel.findOneAndUpdate({ _id: transactionId }, { success: true }, { new: true });
    return transaction && transaction.success;
  }
  catch (err) {
    throw err;
  }
};

const deleteTransactionById = async (user, transactionId) => {
  try {
    const remove = await TransactionModel.deleteOne({ _id: transactionId, user });
    return remove && remove.ok === 1 ? 'Transaction Deleted' : 'Transaction/User is incorrect';
  }
  catch (err) {
    throw err;
  }
};

export { createTransaction, verifyTransaction, getATransactionWhere, getUserTransactions, setTransactionSuccess, deleteTransactionById };