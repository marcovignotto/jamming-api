import { Injectable, HttpException } from '@nestjs/common';

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
  public async getAllJams(): Promise<object[]> {
    const allJams = await this.jamModel.find();

    return allJams;
  }

  /**
   * @function postJam
   * @desc to create a jam
   * @returns obj with the created jam
   */

  public async postJam(jamToCreate: IJam): Promise<IJam> {
    console.log('jamToCreate', jamToCreate);
    try {
      // check if there's another jam withthe same url
      const jamUrl = await this.jamModel.findOne({
        jamUrl: jamToCreate.jamUrl,
      });

      if (jamUrl) {
        throw new HttpException(`Jam url already exists`, 400);
      }

      // check if there's another jam withthe same name
      const jamName = await this.jamModel.findOne({
        jamName: jamToCreate.jamName,
      });
      if (jamName) {
        throw new HttpException(`Jam name already exists`, 400);
      }

      // find host
      const jamHost = await this.userModel.findOne({
        email: jamToCreate.hostEmail,
      });

      // generate jam code
      const generatedJamCode = crypto.randomBytes(6).toString('hex');

      const jamToSave = await new this.jamModel({
        ...jamToCreate,
        host: jamHost._id,
        joinedInstruments: jamHost.instrument,
        availableInstruments: jamToCreate.instruments,
        playersLeft: jamToCreate.totalNumberOfPlayers - 1,
        jamCode: generatedJamCode,
        hostEmail: '', // empty email
      });

      const savedJam = await jamToSave.save();

      return savedJam;
    } catch (error) {
      console.log(error);
      throw new HttpException(`${error}`, 500);
    }
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
