import { ApiProperty } from '@nestjs/swagger';

export class CreateJamDto {
  @ApiProperty({
    description: 'Email',
    example: 'johndoe@gmail.com',
  })
  readonly hostEmail: string;
  @ApiProperty({
    description: 'Jam title',
    example: 'Jam with me',
  })
  readonly jamName: string;
  @ApiProperty({
    description: 'Url converted from the name',
    example: 'jam-with-me',
  })
  readonly jamUrl: string;
  @ApiProperty({
    description: 'Code',
    example: 'sdsdsdasds',
  })
  readonly jamCode?: string;

  @ApiProperty({
    description: 'Host Name',
    example: '{firstName: "John", lastName: "Doe",...}',
  })
  readonly host?: string;
  @ApiProperty({
    description: 'The players',
    example:
      '[{firstName: "John", lastName: "Doe", instrument: "Guitar"}, ...]',
  })
  readonly joinedPlayers?: string[];
  @ApiProperty({
    description: 'Instruments for the jam',
    example: '["Guitar", "Sax", "Drum",...]',
  })
  readonly instruments: string[];
  @ApiProperty({
    description: 'The instruments already joined',
    example: '["Bass Guitar",...]',
  })
  readonly joinedInstruments?: string[];
  @ApiProperty({
    description: 'The instrumnets that are missing for the Jam',
    example: '["Sax", "Drum",...]',
  })
  readonly availableInstruments?: string[];
  @ApiProperty({
    description: 'THe total number of players',
    example: '4',
  })
  readonly totalNumberOfPlayers: number;
  @ApiProperty({
    description: 'The players missing before the start',
    example: '2',
  })
  readonly playersLeft?: number;
  @ApiProperty({
    description: 'Music genre the host would like to play',
    example: 'Jazz',
  })
  readonly kindOfMusic: string;
  @ApiProperty({
    description: 'If the jam started or not',
    example: 'false',
  })
  readonly started?: boolean;
  @ApiProperty({
    description: 'When will take place',
    example: '2021-12-19T16:52:09.551+00:00',
  })
  readonly startingDate?: Date;
  @ApiProperty({
    description: 'Creation date',
    example: '2021-12-19T16:52:09.551+00:00',
  })
  readonly createdAt?: Date;
}

export class UrlJamDto {
  readonly url: string;
}
