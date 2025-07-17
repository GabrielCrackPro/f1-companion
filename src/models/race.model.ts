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
  Circuit: Circuit;
  date: string;
  time?: string;
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Qualifying?: Session;
  Sprint?: Session;
  SprintQualifying?: Session;
  Flag?: any;
}
export interface LapTiming {
  driverId: string;
  position: string;
  time: string;
}

export interface LapData {
  Timings: LapTiming[];
  number: string;
}
