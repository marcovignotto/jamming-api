// interace for mongo schema
export interface IJam extends Document {
  jamName: string;
  jamUrl: string;
  jamCode: string;
  host: string;
  joinedPlayers: string[];
  instruments: string[];
  joinedInstruments: string[];
  availableInstruments: string[];
  totalNumberOfPlayers: number;
  kindOfMusic: string;
  startingDate?: Date;
  createdAt?: Date;
}
