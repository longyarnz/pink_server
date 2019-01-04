/**
 * @fileoverview Creates a Hookup schema for the database.
 * @exports mongoose.model
 */
import mongoose from '../connection/db';

const Schema = mongoose.Schema;

const Hookup = new Schema({
  randomKey: String,
  client: String,
  worker: String,
  completed: { type: Boolean, default: false },
  date_created: { type: Date, default: Date.now },
});

export default mongoose.model('Hookup', Hookup);