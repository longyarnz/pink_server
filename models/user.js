/**
 * @fileoverview Creates a schema for the database.
 * @exports mongoose.model
 */
import mongoose from '../connection/db';

const Schema = mongoose.Schema;

const User = new Schema({
  worker: { type: Boolean, default: false },
  isActivated: { type: Boolean, default: false },
  emailIsVerified: { type: Boolean, default: false },
  email: String,
  password: String,
  username: String,
  phone: String,
  location: { type: String, default: 'Lagos Mainland' },
  rates: [{ type: Number, default: [0, 0, 0] }],
  rank: { type: Number, default: 5 },
  images: [ String ],
  date_created: { type: Date, default: Date.now }
});

export default mongoose.model('User', User);