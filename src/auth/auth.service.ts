import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

// mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// interfaces
import { IUser } from '../interfaces/user.interfaces';

import {
  IRequestToken,
  IResponseRequestToken,
} from '../interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  /**
   * @desc middleware
   */
  async validateAndGetToken(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email: email });

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

    // create payload
    const payload = {
      user: { _id: user._id, role: user.role, userCode: user.userCode },
    };

    // creates and returns a token
    const tokenToReturn = this.jwtService.sign(payload);

    return { token: tokenToReturn };
  }

  /**
   * @function getUserData
   * @param token
   * @desc to get the user data by a token
   * @returns the userdata
   */
  // TODO
  public getUserData(token) {
    return token;
  }

  /**
   * @function postToGetToken
   * @param email
   * @param password
   * @desc to get a token
   * @returns the token
   */

  public async postToGetToken(
    token: IResponseRequestToken,
  ): Promise<IResponseRequestToken> {
    return token;
  }
}
