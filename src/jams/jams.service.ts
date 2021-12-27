import { Injectable, HttpException } from '@nestjs/common';

import * as crypto from 'crypto';
import slugify from 'slugify';

// mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

// models
import { User } from '../schemas/user.schema';
import { Jam, JamDocument } from '../schemas/jam.schema';

// interfaces
import { IUser } from '../interfaces/user.interfaces';

import { IJam, IUrlJam, IUrlReq } from '../interfaces/jam.interfaces';

@Injectable()
export class JamsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Jam') private readonly jamModel: Model<Jam>,
  ) {}

  /**
   * @function getAllJams
   * @desc to get all the jams
   * @returns array of available jam
   */
  public async getAllJams(all: boolean, user): Promise<Jam[]> {
    // if true the user request all the jams
    // NOT jsut the ones avaible based on the instrument
    if (all) {
      const allJams = await this.jamModel
        .find()
        // select just some fields
        .populate('host', 'firstName lastName instrument -_id') //
        .populate('joinedPlayers', 'firstName lastName instrument -_id');
      return allJams;
    } else if (all === undefined) {
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
        .populate('host', 'firstName lastName instrument -_id') //
        .populate('joinedPlayers', 'firstName lastName instrument -_id');

      return avaibleJams;
    }
  }

  /**
   * @function postJam
   * @desc to create a jam
   * @returns obj with the created jam
   */

  public async postJam(jamToCreate: Jam): Promise<Jam> {
    // convert name to url with slugfy
    const newJamUrl = slugify(jamToCreate.jamName.toString(), {
      lower: true,
    });

    // check if there's another jam withthe same name
    const jamName = await this.jamModel.findOne({
      jamName: jamToCreate.jamName,
    });

    if (jamName) {
      throw new HttpException(`Jam name already exists`, 400);
    }

    // check if there's another jam with the same url
    const jamUrl = await this.jamModel.findOne({
      jamUrl: newJamUrl,
    });

    if (jamUrl) {
      throw new HttpException(`Jam url already exists`, 400);
    }

    // find host
    const jamHost = await this.userModel.findOne({
      email: jamToCreate['hostEmail'],
    });

    // generate jam code
    const generatedJamCode = crypto.randomBytes(6).toString('hex');

    const jamToSave = await new this.jamModel({
      ...jamToCreate,
      jamUrl: newJamUrl,
      host: jamHost._id,
      // spread instruments and add host's instrument
      instruments: [...jamToCreate.instruments, jamHost.instrument],
      joinedPlayers: [jamHost._id],
      // add host's instrument
      joinedInstruments: [jamHost.instrument],
      // rest of the instruments
      availableInstruments: jamToCreate.instruments,
      // total - the host
      playersLeft: jamToCreate.totalNumberOfPlayers - 1,
      jamCode: generatedJamCode,
      hostEmail: '', // empty email
    });

    const savedJam = await jamToSave.save();

    return savedJam;
  }
  /**
   * @function updateJam
   * @param url
   * @desc to update or join a jam
   * @returns obj with the updated jam
   */

  public async updateJam(url: string, user: IUrlReq): Promise<Jam> {
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

          $set: {
            // 4. playersLeft: totalNumberOfPlayers - joinedPlayers
            playersLeft:
              jamToJoin.totalNumberOfPlayers -
              (jamToJoin.joinedPlayers.length + 1), // add cause in the first round the value is not updated yet
            // 5. started: playersLeft - 1 === 0 ? true : false
            started: Number(jamToJoin.playersLeft) - 1 === 0 ? true : false, // remove one cause is not updated
          },
        },
        { new: true },
      )
      .exec();

    return updateJam;
  }

  /**
   * @function deleteJam
   * @desc to delete a jam
   * @returns string with the deleted jam
   */

  public async deleteJam(url: string, user: IUrlReq): Promise<string> {
    // the user that requests
    const checkUserRequest = await this.userModel.find({ email: user.email });

    // the requested jam
    const findJam = await this.jamModel.findOne({ jamUrl: url });

    // check if the user is the jam's host
    // compare the jam's host is with the user id
    if (checkUserRequest[0]['_id'].toString() !== findJam.host.toString()) {
      throw new HttpException(
        `Invalid credentials for the requested operation!`,
        401,
      );
    }

    const jamToDelete = await this.jamModel.findOneAndDelete({
      jamUrl: url,
    });
    // delete
    return `${checkUserRequest[0]['firstName']} ${checkUserRequest[0]['lastName']} deleted the jam ${jamToDelete['jamName']}`;
  }
}
