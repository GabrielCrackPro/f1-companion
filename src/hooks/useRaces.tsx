import { useCallback, useEffect, useState } from "react";
import { racesMapper } from "../mappers";
import { Race, Response } from "../models";
import { useAxios } from "./useAxios";
import { useSeasonContext } from "./useSeasonContext";

interface UseRacesProps {
  limit?: number;
}

export const useRaces = ({ limit }: UseRacesProps) => {
  const { season } = useSeasonContext();
  const [races, setRaces] = useState<Response<Race[]> | null>(null);
  const [race, setRace] = useState<Race | null>(null);
  const [seasons, setSeasons] = useState<number[] | null>(null);

  const {
    get: fetchRaces,
    loading,
    error,
  } = useAxios<Race[]>(`${season}/races`);

  const getRaces = useCallback(
    async (overrideLimit?: number) => {
      const response = await fetchRaces({
        limit: overrideLimit ?? limit,
      });
      if (response) {
        const mapped = racesMapper(response);
        setRaces(mapped);
      }
    },
    [fetchRaces, limit]
  );

  const getRace = useCallback(
    (season: number, round: number): Race | null => {
      const found =
        races?.data?.find((r) => r.season === season && r.round === round) ||
        null;
      setRace(found);
      return found;
    },
    [races]
  );

  useEffect(() => {
    const seasons = races?.data?.map((r) => r.season);
    const distinctSeasons = [...new Set(seasons)];
    setSeasons(distinctSeasons);
    getRaces();
  }, [getRaces]);

  return { races, seasons, race, loading, error, getRaces, getRace };
};
