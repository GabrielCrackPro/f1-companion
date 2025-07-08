import { Race } from "../models";
import { formatDate, formatTime } from "../utils";
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

const mapSession = (
  data: any,
  type: "Results" | "QualifyingResults" | "SprintResults"
) => {
  try {
    return data?.MRData?.RaceTable?.Races?.[0]?.[type] || [];
  } catch (e) {
    console.warn("Invalid session data for type:", type, data);
    return [];
  }
};

export const raceDetailsMapper = (
  data: { type: "results" | "qualifying" | "sprint"; data: any }[]
) => {
  const raceResults = data.find((d) => d.type === "results")?.data;
  const qualifyingResults = data.find((d) => d.type === "qualifying")?.data;
  const sprintResults = data.find((d) => d.type === "sprint")?.data;

  return {
    results: mapSession(raceResults, "Results"),
    qualifying: mapSession(qualifyingResults, "QualifyingResults"),
    sprint: mapSession(sprintResults, "SprintResults"),
  };
};

const getSrssionName = (sessionIndex: number) => {
  const names = [
    "FP1",
    "FP2",
    "FP3",
    "Qualifying",
    "Sprint",
    "Sprint Qualifying",
  ];
  return names[sessionIndex];
};

export const sessionsMapper = (data: any) => {
  const race = data.MRData.RaceTable.Races[0];
  return [
    race.FirstPractice,
    race.SecondPractice,
    race.ThirdPractice,
    race.Qualifying,
    race.Sprint,
    race.SprintQualifying,
  ]
    .filter((s: any) => s)
    .map((s: any, index: number) => ({
      ...s,
      name: getSrssionName(index),
      date: formatDate(s.date),
      time: formatTime(s.time),
    }));
};
