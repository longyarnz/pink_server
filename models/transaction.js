/**
 * @fileoverview Creates a Tranaction schema for the database.
 * @exports mongoose.model
 */
import mongoose from '../connection/db';

const Schema = mongoose.Schema;

const Transaction = new Schema({
  success: { type: Boolean, default: false },
  amount: Number,
  user: { type: String, ref: 'User'},
  hookup: String,
  purpose: String,
  date_created: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', Transaction);