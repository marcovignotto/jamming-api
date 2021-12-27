import { Injectable, HttpException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

// interfaces
import { CreateUserInterface } from '../interfaces/user.interfaces';

import { IUrlReq } from '../interfaces/jam.interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  public async getAllUsers(): Promise<User[]> {
    const getAllUsersFromDb = await this.userModel.find();

    return getAllUsersFromDb;
  }

  /**
   * @function postUser
   * @desc ot post a user
   * @returns obj witrh the created user
   */

  public async postUser(obj: CreateUserInterface): Promise<User> {
    // destruc
    const { email, password } = obj;

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
  }

  /**
   * @function updateUser
   * @desc to update a user
   * @returns obj with the updated user
   */

  public async updateUser(id: string, obj: User): Promise<User> {
    // find and update using the mongo _id
    const userUpdated = await this.userModel.findOneAndUpdate(
      { _id: id },
      obj,
      {
        new: true,
      },
    );

    if (!userUpdated) {
      throw new HttpException(`Bad request`, 400);
    }

    return userUpdated;
  }

  /**
   * @function deleteUser
   * @desc to delete a user
   * @returns obj with the deleted user
   */

  public async deleteUser(id: string, user: IUrlReq): Promise<string> {
    // the user that requests

    const checkUserRequest = await this.userModel.find({ email: user.email });

    // if the use ris admin can anyway delete the user
    if (checkUserRequest[0]['role'] === 'admin') {
      await this.userModel.findOneAndDelete({
        email: user.email,
      });
      // delete
      const deleteConfirmation = `User ${checkUserRequest[0]['firstName']} ${checkUserRequest[0]['lastName']} deleted!`;

      return deleteConfirmation;
    }

    // if the user does not exist
    if (!checkUserRequest) {
      throw new HttpException(`Invalid user!`, 401);
    }

    // check the extracted id from email (token)
    // with the request id
    // and will be deleted
    // easy effective double check
    if (checkUserRequest[0]['_id'].toString() !== id.toString()) {
      throw new HttpException(
        `Invalid credentials for the requested operation!`,
        401,
      );
    }

    await this.userModel.findOneAndDelete({
      email: user.email,
    });
    // delete
    const deleteConfirmation = `User ${checkUserRequest[0]['firstName']} ${checkUserRequest[0]['lastName']} deleted!`;

    return deleteConfirmation;
  }
}
