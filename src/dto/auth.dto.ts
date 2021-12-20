import { ApiProperty } from '@nestjs/swagger';

export class RequestUserToken {
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
}

export class RequestUserDataDto {
  @ApiProperty({
    description: 'A valid token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...HAM9jPuGM',
  })
  readonly access_token: string;
}
