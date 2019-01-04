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


const setTransactionAsComplete = async (transactionId) => {
  try {
    const transaction = await TransactionModel.findOneAndUpdate({ _id: transactionId }, { success: true }, { new: true });
    return transaction.completed;
  }
  catch (err) {
    throw err;
  }
};

const deleteTransactionById = async (transactionId) => {
  try {
    const remove = await TransactionModel.deleteOne({ _id: transactionId });
    return remove.ok === 1;
  }
  catch (err) {
    throw err;
  }
};

export { createTransaction, getATransactionWhere, getUserTransactions, setTransactionAsComplete, deleteTransactionById };