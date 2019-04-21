/**
 * @fileoverview Creates a Tranaction schema for the database.
 * @exports mongoose.model
 */
import mongoose from '../connection/db';

const Schema = mongoose.Schema;

const Mail = new Schema({
  name: String,
  email: String,
  text: String,
  purpose: String,
  date_created: { type: Date, default: Date.now },
});

export default mongoose.model('Mail', Mail);