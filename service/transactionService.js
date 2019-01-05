/**
 * @fileoverview Methods for querying data from the transactions collection.
 * @exports { createTransaction, getATransactionWhere, getUserTransactions, deleteTransactionById }
 */
import TransactionModel from '../models/transaction';

const createTransaction = async (amount, user, hookup) => {
  try {
    const transaction = await TransactionModel.create({ amount, user, hookup });
    return transaction;
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


const setTransactionSuccess = async (user, transactionId) => {
  try {
    const transaction = await TransactionModel.findOneAndUpdate({ _id: transactionId, user }, { success: true }, { new: true });
    return transaction && transaction.success ? 'Transaction is successful' : 'Transaction/User is incorrect';
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

export { createTransaction, getATransactionWhere, getUserTransactions, setTransactionSuccess, deleteTransactionById };