import * as mongoose from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userCode: { type: String, required: true },
  // array to have more instruments
  instrument: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  // referenfe to give the current jam attended b the user
  currentJam: {
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: 'Jam',
  },
});
