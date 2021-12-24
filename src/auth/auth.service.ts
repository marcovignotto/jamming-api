import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

// mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

// interfaces
import { IUser } from '../interfaces/user.interfaces';

import {
  IRequestToken,
  IResponseRequestToken,
} from '../interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * @function getUserData
   * @param user
   * @desc to get the user data by a token
   * @returns the userdata
   */
  async getUserData(user): Promise<User> {
    // find user by email and return all info
    const userFind = await this.userModel.findOne({ email: user.email });
    //TODO
    // console.log('userFind', user);

    // return error if the user does not exist
    if (!user) {
      throw new HttpException(`Invalid credentials!`, 401);
    }

    return userFind;
  }

  /**
   * @function postToGetToken
   * @param email
   * @param password
   * @desc to get a token
   * @returns the token
   */

  async login(user: any): Promise<object> {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * @desc middleware
   */

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException(`Invalid credentials!`, 401);
    }

    /**
     * @desc compares the provided password with
     * the user password extracted with the email
     */

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new HttpException(`Invalid credentials!`, 401);
    }

    return user;
  }
}
