export class CreateJamDto {
  readonly hostEmail: string;
  readonly jamName: string;
  readonly jamUrl: string;
  readonly jamCode?: string;
  readonly host?: string;
  readonly joinedPlayers?: string[];
  readonly instruments: string[];
  readonly joinedInstruments?: string[];
  readonly availableInstruments?: string[];
  readonly totalNumberOfPlayers: number;
  readonly playersLeft?: number;
  readonly kindOfMusic: string;
  readonly started?: boolean;
  readonly startingDate?: Date;
  readonly createdAt?: Date;
}
