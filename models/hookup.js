/**
 * @fileoverview Creates a Hookup schema for the database.
 * @exports mongoose.model
 */
import mongoose from '../connection/db';

const Schema = mongoose.Schema;

const Hookup = new Schema({
  randomKey: String,
  workerKey: String,
  clientKey: String,
  clientHasVerified: { type: Boolean, default: false },
  workerHasVerified: { type: Boolean, default: false },
  client: { type: String, ref: 'User' },
  worker: { type: String, ref: 'User' },
  rank: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  date_created: { type: Date, default: Date.now }
});

export default mongoose.model('Hookup', Hookup);