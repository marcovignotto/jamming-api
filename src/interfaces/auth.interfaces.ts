// interface to request a token
export interface IRequestToken {
  email: string;
  password: string;
}

// interface token
export interface IResponseRequestToken {
  token: string;
}
