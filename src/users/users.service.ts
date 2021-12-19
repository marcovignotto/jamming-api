import { Injectable, HttpException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import * as crypto from 'crypto';

// mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

// models
import { UserSchema } from '../schemas/user.schema';

// interfaces
import {
  CreateUserInterface,
  PromiseCreateUserInterface,
  IUser,
} from '../interfaces/user.interfaces';

export interface PostUserResponse {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userCode: string;
  instruments: string[];
  role: string;
}

export interface PostUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  instruments: string[];
  role: string;
}

export interface DeleteUserResponse {
  deleteConfirmation: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  public async getAllUsers(): Promise<object[]> {
    const getAllUsersFromDb = await this.userModel.find();

    return getAllUsersFromDb;
  }

  /**
   * @function postUser
   * @desc ot post a user
   * @returns obj witrh the created user
   */

  public async postUser(
    obj: CreateUserInterface,
  ): Promise<PromiseCreateUserInterface> {
    // destruc
    const { email, password } = obj;

    try {
      // check if email is already in use
      const signupEmail = await this.userModel.findOne({ email });

      if (signupEmail) {
        throw new HttpException('Email already registered!', 409);
      }
      // generate salt
      const salt = await bcrypt.genSalt(10);

      // generate Password
      const hashedPassword = await bcrypt.hash(password, salt);

      // generate accountCode
      const generatedAccountCode = crypto.randomBytes(6).toString('hex');

      // create the new obj to save

      const userToSave = await new this.userModel({
        ...obj,
        password: hashedPassword,
        userCode: generatedAccountCode,
      });
      const savedDocument = await userToSave.save();

      return savedDocument;
    } catch (error) {
      console.log(error);
      throw new HttpException(`${error}`, 400);
    }
  }

  /**
   * @function updateUser
   * @desc to update a user
   * @returns obj with the updated user
   */

  public async updateUser(
    id: string,
    //     id: Schema.Types.ObjectId,
    obj: CreateUserInterface,
  ): Promise<PromiseCreateUserInterface> {
    try {
      // find and update using the mongo _id
      const userUpdated = await this.userModel.findOneAndUpdate(
        { _id: id },
        obj,
        {
          new: true,
        },
      );

      return userUpdated;
    } catch (error) {
      console.log(error);
      throw new HttpException(`${error}`, 400);
    }
  }

  /**
   * @function deleteUser
   * @desc to delete a user
   * @returns obj with the deleted user
   */

  public deleteUser(firstName: string, lastName: string, id: string) {
    const deleteConfirmation = `User ${firstName} ${lastName} with the id ${id} deleted`;

    return deleteConfirmation;
  }
}
