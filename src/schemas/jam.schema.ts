import * as mongoose from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export const JamSchema = new mongoose.Schema({
  jamName: { type: String, required: true },
  jamUrl: { type: String, required: true },
  host: {
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  joinedPlayers: [
    {
      type: MongooseSchema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  jamCode: { type: String, required: true },
  // array to have more instruments
  instruments: { type: Array, required: true },
  joinedInstruments: { type: Array, required: true },
  availableInstruments: { type: Array, required: true },
  totalNumberOfPlayers: { type: Number, required: true },
  playersLeft: { type: Number, required: true },
  started: { type: Boolean, required: true, default: false },
  kindOfMusic: { type: String, required: true, default: 'user' },
  startingDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  // referenfe to give the current jam attended b the user
});
