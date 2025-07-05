import { Circuit } from "./circuit.model";

export interface Session {
  date: string;
  time: string;
}

export interface Race {
  season: number;
  round: number;
  url: string;
  raceName: string;
  circuit: Circuit;
  date: string;
  time?: string;
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Qualifying?: Session;
  Sprint?: Session;
  SprintQualifying?: Session;
}
