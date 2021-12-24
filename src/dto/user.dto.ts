// DTO used by postUser and updateUser
import { ApiProperty } from '@nestjs/swagger';
import { Jam } from '../schemas/jam.schema';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name',
    example: 'John',
  })
  readonly firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  readonly lastName: string;

  @ApiProperty({
    description: 'Valid Email',
    example: 'johndoe@gmail.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Valid Password',
    example: 'changeToAStrongerPassword',
  })
  readonly password: string;

  @ApiProperty({
    description: 'Instrument',
    example: 'Guitar',
  })
  readonly instrument: string;

  @ApiProperty({
    description: 'Uper privileges',
    example: 'admin or user',
    default: 'user',
  })
  readonly role: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Name',
    example: 'John',
  })
  readonly firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  readonly lastName: string;

  @ApiProperty({
    description: 'Valid Email',
    example: 'johndoe@gmail.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Valid Password',
    example: 'changeToAStrongerPassword',
  })
  readonly password: string;

  @ApiProperty({
    description: 'Instrument',
    example: 'Guitar',
  })
  readonly instrument: string;

  @ApiProperty({
    description: 'User privileges',
    example: 'admin or user',
    default: 'user',
  })
  readonly role: string;

  @ApiProperty({
    description: 'The auto generated user code',
    example: 'j3ask49f',
  })
  readonly userCode?: string;

  @ApiProperty({
    description: 'Date of registration',
    example: '2021-12-19T16:52:09.551+00:00',
  })
  readonly createdAt?: string;

  @ApiProperty({
    description: 'The jam the user is currently in, if is in one',
    example: '{jamName: "jam", ...}',
  })
  readonly currentJam?: Jam;
}

export class PromiseCreateUserDto {
  @ApiProperty({
    description: 'Name',
    example: 'John',
  })
  readonly firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  readonly lastName: string;

  @ApiProperty({
    description: 'Valid Email',
    example: 'johndoe@gmail.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Valid Password',
    example: 'changeToAStrongerPassword',
  })
  readonly password: string;

  @ApiProperty({
    description: 'Instrument',
    example: 'Guitar',
  })
  readonly instrument: string;

  @ApiProperty({
    description: 'Uper privileges',
    example: 'admin or user',
    default: 'user',
  })
  readonly role: string;

  @ApiProperty({
    description: 'User code auto generated',
    example: '16078c975658',
  })
  readonly userCode: string;

  @ApiProperty({
    description: 'Mongo Id',
    example: '61bf6339d5cba76a4a04505e',
  })
  readonly _id: string;

  @ApiProperty({
    description: 'User creation Date',
    example: '2021-12-19T16:52:09.551+00:00',
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Mongo',
    example: '0',
  })
  readonly __v: number;
}
