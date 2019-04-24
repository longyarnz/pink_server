/**
 * @fileoverview Creates a Tranaction schema for the database.
 * @exports mongoose.model
 */
import mongoose from '../connection/db';

const Schema = mongoose.Schema;

const Reset = new Schema({
  email: String,
  status: { type: Boolean, default: false },
  date_created: { type: Date, default: Date.now },
});

export default mongoose.model('Reset', Reset);