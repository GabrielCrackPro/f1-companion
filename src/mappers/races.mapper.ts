import { Race } from "../models";
import { commonMapper } from "./common.mapper";

export const racesSortFields: Record<string, keyof Race> = {
  name: "raceName",
  round: "round",
  date: "date",
  time: "time",
};

export const racesMapper = (data: any) => {
  const common = commonMapper(data);
  data = {
    ...common,
    data: data.MRData.RaceTable.Races,
  };

  return data;
};
