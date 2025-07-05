import { useCallback, useEffect, useState } from "react";
import { racesMapper } from "../mappers";
import { Race, Response } from "../models";
import { useAxios } from "./useAxios";

interface UseRacesProps {
  season: number;
  limit?: number;
}

export const useRaces = ({ season, limit }: UseRacesProps) => {
  const [races, setRaces] = useState<Response<Race[]> | null>(null);
  const [race, setRace] = useState<Race | null>(null);

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
    getRaces();
  }, [getRaces]);

  return { races, race, loading, error, getRaces, getRace };
};
