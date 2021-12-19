export class RequestUserToken {
  readonly email: string;
  readonly password: string;
}

export class RequestUserData {
  readonly token: string;
}
