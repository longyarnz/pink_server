/**
 * @fileoverview MongoDB Database configuration.
 * @exports mongoose
 */
import mongoose from 'mongoose';
import promise from 'bluebird';
import { config } from 'dotenv';

config();

/**
 * @description Creates a connection to the MongoDB server
 */
mongoose.Promise = promise;
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useFindAndModify: false });

export default mongoose;