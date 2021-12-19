import { Document, Schema } from 'mongoose';

export class CreateUserInterface {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  instruments?: string[];
  role?: string;
}

export class PromiseCreateUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  instruments: string[];
  role: string;
  userCode?: string;
  _id?: string;
  createdAt?: Date;
  __v?: number;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userCode: string;
  instruments: string[];
  role: string;
  // createdAt?: Date;
  // currentJam?: Schema.Types.ObjectId;
  _id: string;
}
