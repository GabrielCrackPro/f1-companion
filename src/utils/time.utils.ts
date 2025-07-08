import { Race } from "../models";

export const isRaceFinished = (race: Race | null) =>
  race ? new Date(race.date).getTime() < Date.now() : false;

export const isRaceToday = (race: Race | null) => {
  if (!race) return false;
  const date = new Date(race.date);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export const isRaceTomorrow = (race: Race | null) => {
  if (!race) return false;
  const date = new Date(race.date);
  const now = new Date();
  return (
    date.getDate() === now.getDate() + 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export const getNextSession = (race: Race | null) => {
  if (!race) return null;

  const sessionKeys: [keyof Race, string][] = [
    ["FirstPractice", "FP1"],
    ["SecondPractice", "FP2"],
    ["ThirdPractice", "FP3"],
    ["SprintQualifying", "SQ"],
    ["Sprint", "Sprint"],
    ["Qualifying", "Qualifying"],
    ["date", "Race"],
  ];

  for (const [key, label] of sessionKeys) {
    const session = race[key] as { date: string; time: string } | undefined;
    if (!session?.date || !session?.time) continue;

    const sessionTime = new Date(`${session.date}T${session.time}`);
    if (sessionTime.getTime() > Date.now()) {
      return {
        name: label,
        dateTime: `${session.date}T${session.time}`,
      };
    }
  }

  return null;
};

export const isSessionFinished = (date?: string, time?: string) => {
  if (!date || !time) return false;

  const now = new Date();
  const currentYear = now.getFullYear();

  const [month, day] = date.split("/").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  const sessionDate = new Date(currentYear, month - 1, day, hours, minutes);

  return sessionDate.getTime() < now.getTime();
};
