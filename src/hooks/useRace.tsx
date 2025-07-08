import { useCallback } from "react";
import { raceDetailsMapper, racesMapper, sessionsMapper } from "../mappers";
import { useAxios } from "./useAxios";

export const useRace = () => {
  const { getMultiple, loading, error } = useAxios("races");

  const getRaceResults = useCallback(
    async (season: number, round: number) => {
      const endpoints = [
        `${season}/${round}/results`,
        `${season}/${round}/qualifying`,
        `${season}/${round}/sprint`,
      ];
      const response = await getMultiple(endpoints);

      if (!response) return null;

      const typeData: any = [
        { type: "results", data: response[0] },
        { type: "qualifying", data: response[1] },
        { type: "sprint", data: response[2] },
      ];

      return raceDetailsMapper(typeData);
    },
    [getMultiple]
  );

  const getRaceSessions = useCallback(
    async (season: number, round: number) => {
      const response = await getMultiple([`${season}/${round}`]);

      if (!response) return null;

      return sessionsMapper(response[0]);
    },
    [getMultiple]
  );

  return { getRaceResults, getRaceSessions, loading, error };
};
