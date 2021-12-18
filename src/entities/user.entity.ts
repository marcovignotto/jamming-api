import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// import { Client } from './client.entity';
// import { Product } from './product.entity';
// import { User } from './user.entity';

@Schema()
export class User extends Document {
  //     type: MongooseSchema.Types.ObjectId,
  //     required: false,
  //     ref: Client.name,
  //   })
  //   client: MongooseSchema.Types.ObjectId;

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

  @Prop({ type: Array, required: true })
  instruments: string[];

  @Prop({ type: String, required: true, default: 'player' })
  role: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: 'Jam' })
  currentJam: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
