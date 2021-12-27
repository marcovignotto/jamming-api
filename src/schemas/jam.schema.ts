/**
 * @desc User Schema, ref to Jam
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from './user.schema';

export type JamDocument = Jam & Document;

@Schema()
export class Jam {
  @Prop({ type: String, required: true })
  jamName: string;

  @Prop({ type: String, required: false })
  jamUrl: string;

  @Prop({ type: String, required: true })
  jamCode: string;

  @Prop({ type: String, required: true })
  kindOfMusic: string;

  @Prop({ type: Number, required: true })
  playersLeft: number;

  @Prop({ type: Number, required: true })
  totalNumberOfPlayers: number;

  @Prop({ type: Array, required: true })
  instruments: string[];

  @Prop({ type: Array, required: true })
  joinedInstruments: string[];

  @Prop({ type: Array, required: true })
  availableInstruments: string[];

  @Prop({ type: Boolean, required: true, default: false })
  started: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: string;

  @Prop({ type: Date, default: Date.now })
  startingDate: string;

  // to populate the host
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: 'User',
  })
  host: User;

  // to populate the players
  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
  ])
  joinedPlayers: User[];
}

export const JamSchema = SchemaFactory.createForClass(Jam);
