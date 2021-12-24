/**
 * @desc User Schema, ref to Jam
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Jam } from './jam.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  userCode: string;

  @Prop({ type: String, required: true })
  instrument: string;

  @Prop({ type: String, required: true, default: 'user' })
  role: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: string;

  // reference to give the current jam attended b the user
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: 'Jam',
  })
  currentJam: Jam;
}

export const UserSchema = SchemaFactory.createForClass(User);
