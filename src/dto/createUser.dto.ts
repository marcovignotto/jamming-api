export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly instruments: string[];
  readonly role: string;
}

export class PromiseCreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly instruments: string[];
  readonly role: string;
  readonly userCode: string;
  readonly _id: string;
  readonly createdAt: Date;
  readonly __v: number;
}
