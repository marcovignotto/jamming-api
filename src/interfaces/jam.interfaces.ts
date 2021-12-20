// interace for mongo schema
// fot the schema and for the post to create it
export interface IJam {
  hostEmail: string;
  jamName: string;
  jamUrl: string;
  jamCode?: string;
  host?: string;
  joinedPlayers?: string[];
  instruments: string[];
  joinedInstruments?: string[];
  availableInstruments?: string[];
  totalNumberOfPlayers: number;
  playersLeft?: number;
  kindOfMusic: string;
  started?: boolean;
  startingDate?: Date;
  createdAt?: Date;
}

export interface IUrlJam {
  url: string;
}

export interface IUrlReq {
  email: string;
  userId?: string;
}
