import { useCallback } from "react";
import { raceDetailsMapper, sessionsMapper } from "../mappers";
import { useAxios } from "./useAxios";
import { useCalendar } from "./useCalendar";

export const useRace = () => {
  const { getMultiple, loading, error } = useAxios("races");
  const { addEventToCalendar } = useCalendar();

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

  const addRaceToCalendar = useCallback(
    async (
      sessions: {
        location?: {
          lat: number;
          long: number;
          locality: string;
          country: string;
        };
        name: string;
        date: string;
        time: string;
      }[]
    ) => {
      if (!sessions || sessions.length === 0) return;

      const getDateWithYear = (monthDay: string, time: string) => {
        const [month, day] = monthDay.split("/").map(Number);
        const currentYear = new Date().getFullYear();
        const [hours, minutes] = time.split(":").map(Number);
        return new Date(currentYear, month - 1, day, hours, minutes);
      };

      // Orden correcto de sesiones para F1
      const sessionOrder = [
        "FP1",
        "FP2",
        "FP3",
        "SprintQualifying",
        "Sprint",
        "Qualifying",
        "Race",
      ];

      const sortedSessions = [...sessions].sort((a, b) => {
        const dateA = getDateWithYear(a.date, a.time).getTime();
        const dateB = getDateWithYear(b.date, b.time).getTime();

        if (dateA !== dateB) return dateA - dateB;

        const indexA = sessionOrder.findIndex((s) =>
          a.name.toLowerCase().includes(s.toLowerCase())
        );
        const indexB = sessionOrder.findIndex((s) =>
          b.name.toLowerCase().includes(s.toLowerCase())
        );

        return indexA - indexB;
      });

      const raceLocation = sessions.find((s) => s.location)?.location;
      const locationStr = raceLocation
        ? `${raceLocation.locality}, ${raceLocation.country}`
        : undefined;

      for (const session of sortedSessions) {
        const startDate = getDateWithYear(session.date, session.time);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hora

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.warn(
            "Invalid date format or time",
            session.date,
            session.time
          );
          continue;
        }

        await addEventToCalendar({
          title: session.name,
          startDate,
          endDate,
          location: locationStr,
        });
      }
    },
    [addEventToCalendar]
  );

  return {
    getRaceResults,
    getRaceSessions,
    addRaceToCalendar,
    loading,
    error,
  };
};
