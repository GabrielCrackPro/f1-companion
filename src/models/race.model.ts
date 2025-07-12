import { Circuit } from "./circuit.model";

export interface Session {
  name: string;
  date?: string;
  time?: string;
}

export interface Race {
  season: string;
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
