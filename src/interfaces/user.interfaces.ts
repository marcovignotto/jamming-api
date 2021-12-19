import { Document, Schema } from 'mongoose';

// request to create a user
export interface CreateUserInterface {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  instruments?: string[];
  role?: string;
}

// user to return the user after creation
// used to return the user after the get auth request
export interface PromiseCreateUserInterface {
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
  currentJam?: string;
}

// interace for mongo schema
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
