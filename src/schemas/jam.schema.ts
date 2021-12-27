/**
 * @desc User Schema, ref to Jam
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

import { User } from './user.schema';

export type JamDocument = Jam & Document;

@Schema()
export class Jam {
  @ApiProperty({
    description: 'Jam title',
    example: 'Jam with me',
  })
  @Prop({ type: String, required: true })
  jamName: string;

  @ApiProperty({
    description: 'Url converted from the name',
    example: 'jam-with-me',
  })
  @Prop({ type: String, required: false })
  jamUrl: string;

  @ApiProperty({
    description: 'Code',
    example: 'sdsdsdasds',
  })
  @Prop({ type: String, required: true })
  jamCode: string;

  @ApiProperty({
    description: 'Music genre the host would like to play',
    example: 'Jazz',
  })
  @Prop({ type: String, required: true })
  kindOfMusic: string;

  @ApiProperty({
    description: 'The players missing before the start',
    example: '2',
  })
  @Prop({ type: Number, required: true })
  playersLeft: number;

  @ApiProperty({
    description: 'The total number of players',
    example: '4',
  })
  @Prop({ type: Number, required: true })
  totalNumberOfPlayers: number;

  @ApiProperty({
    description: 'Instruments for the jam',
    example: '["Guitar", "Sax", "Drum",...]',
  })
  @Prop({ type: Array, required: true })
  instruments: string[];

  @ApiProperty({
    description: 'The instruments already joined',
    example: '["Bass Guitar",...]',
  })
  @Prop({ type: Array, required: true })
  joinedInstruments: string[];

  @ApiProperty({
    description: 'The instruments that are missing for the Jam',
    example: '["Sax", "Drum",...]',
  })
  @Prop({ type: Array, required: true })
  availableInstruments: string[];

  @ApiProperty({
    description: 'If the jam started or not',
    example: 'false',
  })
  @Prop({ type: Boolean, required: true, default: false })
  started: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2021-12-19T16:52:09.551+00:00',
  })
  @Prop({ type: Date, default: Date.now })
  createdAt: string;

  @ApiProperty({
    description: 'When will take place',
    example: '2021-12-19T16:52:09.551+00:00',
  })
  @Prop({ type: Date, default: Date.now })
  startingDate: string;

  // to populate the host
  @ApiProperty({
    description: 'Host Name',
    example: '{firstName: "John", lastName: "Doe",...}',
    type: () => MongooseSchema.Types.ObjectId,
  })
  @Prop({
    type: () => MongooseSchema.Types.ObjectId,
    required: false,
    ref: 'User',
  })
  host: User;

  // to populate the players
  @ApiProperty({
    description: 'The players',
    example:
      '[{firstName: "John", lastName: "Doe", instrument: "Guitar"}, ...]',
  })
  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
  ])
  joinedPlayers: User[];
}

export const JamSchema = SchemaFactory.createForClass(Jam);
