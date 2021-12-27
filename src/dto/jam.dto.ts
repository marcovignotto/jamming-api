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
    description: 'Instruments for the jam',
    example: '["Guitar", "Sax", "Drum",...]',
  })
  readonly instruments: string[];

  @ApiProperty({
    description: 'The total number of players',
    example: '4',
  })
  readonly totalNumberOfPlayers: number;

  @ApiProperty({
    description: 'Music genre the host would like to play',
    example: 'Jazz',
  })
  readonly kindOfMusic: string;
}

export class UrlJamDto {
  readonly url: string;
}
