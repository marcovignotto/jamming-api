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
  public async getAllJams(all, user): Promise<object[]> {
    // if true the user request all  the jams
    // NOT jsut the ones avaible based on the instrument
    if (all) {
      const allJams = await this.jamModel
        .find()
        // select just some fields
        .populate('host', 'firstName lastName instrument -_id')
        .populate('joinedPlayers', 'firstName lastName instrument -_id');
      return allJams;
    }

    // find host
    const findPlayer = await this.userModel.findOne({
      email: user.email,
    });

    if (!findPlayer) {
      throw new HttpException(`The user does not exists!`, 401);
    }

    // find al the jams to filter
    const avaibleJams = await this.jamModel
      .find({
        availableInstruments: findPlayer.instrument,
      })
      // select just some fields
      .populate('host', 'firstName lastName instrument -_id')
      .populate('joinedPlayers', 'firstName lastName instrument -_id');

    return avaibleJams;
  }

  /**
   * @function postJam
   * @desc to create a jam
   * @returns obj with the created jam
   */

  public async postJam(jamToCreate: IJam): Promise<IJam> {
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
        // spread instruments and add host's instrument
        instruments: [...jamToCreate.instruments, jamHost.instrument],
        joinedPlayers: [jamHost._id],
        // add host's instrument
        joinedInstruments: jamHost.instrument,
        // rest of the instruments
        availableInstruments: jamToCreate.instruments,
        // total - the host
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
   * @param url
   * @desc to update or join a jam
   * @returns obj with the updated jam
   */

  public async updateJam(url, user) {
    try {
      // find the jam with the url
      const jamToJoin = await this.jamModel.findOne({ jamUrl: url });
      // check if exists
      if (!jamToJoin) {
        throw new HttpException(`Jam does not exist!`, 400);
      }

      // get the user's data (the player that wants to join)
      const userToJoin = await this.userModel.findOne({ email: user.email });
      // check if exists
      if (!userToJoin) {
        throw new HttpException(`User does not exist!`, 400);
      }

      // update fields of the jam
      // 5 steps

      const updateJam = await this.jamModel
        .findOneAndUpdate(
          { jamUrl: url },
          {
            $addToSet: {
              // 1. joinedPlayers: add the player
              joinedPlayers: userToJoin._id,
              // 2. joinedInstruments: add the instrument to array
              joinedInstruments: userToJoin.instrument,
            },

            // 3. availableInstruments: remove the instrument from the array
            $pull: { availableInstruments: userToJoin.instrument },

            // 4. playersLeft: totalNumberOfPlayers - joinedPlayers
            $set: {
              playersLeft:
                jamToJoin.totalNumberOfPlayers -
                (jamToJoin.joinedPlayers.length + 1), // add cause in the first round the value is not updated yet
              // started: playersLeft +1 === 0 ? true : false
              started: jamToJoin.playersLeft + 1 === 0 ? true : false,
            },
          },
          { new: true },
        )
        .exec();

      return updateJam;
    } catch (error) {
      console.log(error);
      throw new HttpException(`${error}`, 500);
    }
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
