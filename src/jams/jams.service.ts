import { Injectable } from '@nestjs/common';

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

import { IJam } from '../interfaces/jam.interfaces';

@Injectable()
export class JamsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Jam') private readonly jamModel: Model<IJam>,
  ) {}

  /**
   * @function getAllJams
   * @desc to get all the jams
   * @returns array of available jam
   */
  public getAllJams() {
    return [];
  }

  /**
   * @function postJam
   * @desc to create a jam
   * @returns obj with the created jam
   */

  public postJam() {
    return 'POST JAM';
  }
  /**
   * @function updateJam
   * @desc to update or join a jam
   * @returns obj with the updated jam
   */

  public updateJam() {
    return 'Update JAM';
  }

  /**
   * @function deleteJam
   * @desc to delete a jam
   * @returns string with the deleted jam
   */

  public deleteJam() {
    return 'Delete JAM';
  }
}
