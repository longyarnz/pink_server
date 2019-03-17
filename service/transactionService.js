/**
 * @fileoverview Methods for querying data from the transactions collection.
 * @exports { createTransaction, getATransactionWhere, getUserTransactions, deleteTransactionById }
 */
import TransactionModel from '../models/transaction';
import paystack from 'paystack';

const createTransaction = async (amount, user, hookup, purpose) => {
  try {
    const transaction = await TransactionModel.create({ amount, user, hookup, purpose });
    return await TransactionModel.findOne({ _id: transaction._id}).populate('user', 'email');
  }
  catch (err) {
    throw err;
  }
};

const verifyTransaction = async ({ reference }) => {
  const PaystackAPI = paystack(process.env.paystack_sk);
  try {
    const transaction = await PaystackAPI.transactions.verify(reference);
    console.log(transaction);
    const isSuccessful = transaction.message === 'Verification successful';
    return isSuccessful ? await setTransactionSuccess(reference) : 'Transaction Failed';
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

export { createTransaction, verifyTransaction, getATransactionWhere, getUserTransactions, setTransactionSuccess, deleteTransactionById };